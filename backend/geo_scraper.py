from flask import Flask, request, jsonify, Response
from flask_cors import CORS 
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup
from urllib.robotparser import RobotFileParser 
import time 
import json

# --- Constants for Robust Scraping ---
USER_AGENT = "WebPageAnalyzer/1.0 (Contact: user@example.com) Python-Requests"
MAX_RETRIES = 1
BASE_BACKOFF_TIME = 20 # Initial wait in seconds for exponential backoff

app = Flask(__name__)
CORS(app) 

# --- Helper Functions ---

def clean_html_for_json(soup):
    """
    Removes non-content elements to isolate the main body text.
    """
    for element in soup(["script", "style", "head", "noscript", "meta", "[document]"]):
        element.extract()
    for selector in ['header', 'nav', 'footer', '.sidebar', '#menu', '.ad-unit']:
        for element in soup.select(selector):
            element.extract()
    text = soup.get_text(separator=' ', strip=True)
    return text

def is_scraping_allowed(url, user_agent):
    """Checks the website's robots.txt file."""
    try:
        parsed_url = urlparse(url)
        robots_url = urljoin(f"{parsed_url.scheme}://{parsed_url.netloc}", "robots.txt")
        rp = RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        return rp.can_fetch(user_agent, url)
    except Exception:
        return False

def scrape_url_for_api(url):
    """Fetches HTML with retry logic, cleans text, and safely extracts the title."""
    
    if not url.startswith('http://') and not url.startswith('https://'):
        url = "https://" + url 
    
    if not is_scraping_allowed(url, USER_AGENT):
        return {
            "title": "ROBOTS_DISALLOWED",
            "text": "Scraping was explicitly disallowed by robots.txt.",
        }
        
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, timeout=15, headers={'User-Agent': USER_AGENT})
            response.raise_for_status() 
            html_content = response.text
            break # Success!
        
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            if status_code in [429, 503] and attempt < MAX_RETRIES - 1:
                wait_time = BASE_BACKOFF_TIME * (2 ** attempt)
                print(f"RATE LIMIT/SERVER ERROR: Retrying {url} in {wait_time}s.")
                time.sleep(wait_time)
                continue
            else:
                return {
                    "title": "FETCH_ERROR",
                    "text": f"HTTP Error fetching page: {status_code} {e.response.reason}",
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "title": "FETCH_ERROR",
                "text": f"Connection Error fetching page: {e}",
            }
    
    else: # Executed if the loop completes without a successful break (i.e., all retries failed)
        return {
            "title": "FETCH_ERROR",
            "text": "All retry attempts failed due to persistent server issues.",
        }
    
    # --- Content Processing ---
    soup = BeautifulSoup(html_content, 'html.parser')
    cleaned_text = clean_html_for_json(soup.body if soup.body else soup)

    title = 'N/A'
    if soup.title and soup.title.string:
        title = soup.title.string.strip()
        
    return {
        "title": title,
        "text": cleaned_text,
    }


# --- The Flask Route (New Single-Item Endpoint) ---
@app.route('/api/scrape_single', methods=['POST'])
def scrape_single_data():
    # Expects a single company object from the React component
    data = request.json 
    
    if data is None or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body. Expected a single company object."}), 400

    company_object = data
    url = company_object.get('website')
    
    if not url:
        scraped_data = {"title": "MISSING_URL", "text": "Website URL was missing."}
    else:
        print(f"Attempting to scrape single URL: {url}")
        scraped_data = scrape_url_for_api(url)
        
    # Prepare the final structured result for this company
    result = {
        "url": url,
        "title": scraped_data.get('title', 'N/A'),
        # Truncate text (or keep the full text if required)
        "text": scraped_data.get('text', 'N/A')[:500] + '...' if len(scraped_data.get('text', '')) > 500 else scraped_data.get('text', 'N/A'),
        "tags": [company_object.get('city', 'N/A'), company_object.get('canton', 'N/A')]
    }
    
    # Return the single result object as JSON
    return jsonify(result)

@app.route('/api/scrape', methods=['POST'])
def scrape_data():
    data = request.json
    
    if data is None or not isinstance(data, list):
        return jsonify({"error": "Invalid JSON body or missing content type header. Expected a list."}), 400

    company_data_list = data
    scraped_results = []

    for company_object in company_data_list:
        url = company_object.get('website')
        
        # Ensure scraped_data is assigned in all logical branches
        if not url:
            # Case 1: URL is missing
            scraped_data = {"title": "MISSING_URL", "text": "Website URL was missing in the input data."}
        else:
            # Case 2: URL is present, perform scraping
            print(f"Attempting to scrape URL: {url}")
            scraped_data = scrape_url_for_api(url)
            
        # Prepare the final structured result for this company
        result = {
            "url": url,
            "title": scraped_data.get('title', 'N/A'),
            # Truncate text (or keep the full text if required)
            "text": scraped_data.get('text', 'N/A')[:500] + '...' if len(scraped_data.get('text', '')) > 500 else scraped_data.get('text', 'N/A'),
            "tags": [company_object.get('city', 'N/A'), company_object.get('canton', 'N/A')] # Desired position 4
        }
        scraped_results.append(result)

    # Use manual serialization (json.dumps) to guarantee the key order
    json_output = json.dumps(scraped_results, indent=2)
    return Response(json_output, mimetype='application/json')

if __name__ == '__main__':
    print("Starting Flask Scraper API on http://localhost:5001")
    # Use debug=True for development, but remove for production
    app.run(port=5001)
