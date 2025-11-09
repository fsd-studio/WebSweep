# FSD Studio Template

Web Scraper and GeoData Analyzer: Quick Start

1. Running the Application (Terminal Instructions)

You must run both the Python Backend and the React Frontend simultaneously. Open two separate terminal windows inside the root of the project folder.

**Terminal 1: Start the Backend (Python Flask Server), ...path/backend**

This runs the server that handles the web scraping logic, available at http://localhost:5000.

Environment Setup & Dependencies:

python -m venv venv 
source venv/bin/activate  for macOS/Linux
Use venv\Scripts\activate for Windows
pip install flask flask-cors requests beautifulsoup4


Run the Flask Server:
Keep this terminal window open and running.

python geo_scraper.py


**Terminal 2: Start the Frontend (React App)** ️

This runs the client application, typically opening a browser window at http://localhost:3000.

Install Node Dependencies:

npm install


Start the React Application:

npm run dev


The application will start, and the GeoData component will automatically call the running Flask server to fetch the data.

2. Accessing Scraped Data (For Developers)

The final scraped JSON data is stored in the React Context, making it available globally. Any consumer component can retrieve the data using the useDataCollection hook:
# ------------------
import { useDataCollection } from 'context/DataCollectionContext'; 

function YourComponent() {

    const { geoDataCollection } = useDataCollection(); 
    
}
# ------------------
