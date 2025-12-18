# Websweep

**Targeted Leads for Web-developers.**

Websweep distinguishes itself as a lead generation tool by utilizing a layered diagnostics approach that provides an assessment of a target website’s digital health. Unlike competitors that provide broad lead generation or exhaustive technical audits, WebSweep processes data across four distinct analytical pillars: GEO (Generative Engine Optimization), SEO (Search Engine Optimization), Performance Metrics, W3C Validation Metrics and an aggregated General Score of them all. These metrics are some of the most important and relevant ones for modern web developers. GEO is an innovative metric based on the research of Aggarwal et al. (2024), “GEO: Generative Engine Optimization,”, that assesses AI understanding of a website, among other things; SEO and performance metrics are a key part of Google’s industry standard Lighthouse metrics, lastly, W3C validation is a long-standing validation too which assesses websites to standardized HTML rules.   

Of course, to judge a website, a web developer can’t just look at the statistics, they must see the actual website, judge the styling, assess the responsiveness, and read its written content. WebSweep handles this by displaying websites locally, on our site, so the user doesn’t even have to leave the page. This page viewer also allows you to quickly toggle between desktop, tablet, and mobile views, allowing for easy responsiveness checks. We believe that our industry-standard, as well as innovative metrics, alongside the locally displayed website, will not only save developers a lot of time; it will also allow them to assess website quality accurately. 

WebSweep automates and centralizes essential analytical lead data for swiss web-developers. Thanks to WebSweep's search functionality, web-developers will be able to search for their customer group according to canton, city and category. Once they have received the list of companies matching their needs, they will see the summarized scores of the evaluation of metrics. Additionally, they can receive a more exhaustive explanation of a specific company by opening their respective details page. On this page, they can see a vast set of metrics and explanations. They are also able to immediately see the chosen website without having to leave our page and could even toggle between the different views to check responsivity. 

## Setup

### 1. Run: `npm install` 

> If you run into a Node versioning error, be sure to install and use Node version 24+

### 2. create .env file in the project root

In the file be sure to include the following: 

    PAGESPEED_API_KEY=""
    SCRAPER_API_URL=""
    DATABASE_URL=""
    TOGETHER_API_KEY=""
    GEO_EXTRACT_MODEL=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo
    GEO_EVAL_MODEL=openai/gpt-oss-120b

> To get the right env variables contact the following address -> vanms1@bfh.ch

### 3. Run: `npx prisma generate`

> This will create the necesarry Prisma client, schema, and migration files for the DB to work properly. 

### 4. Run: `npm run dev`

> This will start the development server and the setup should be complete. 
