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


3. **For GEO:**
   
   Rename the environment file and add your Together.ai API key:
 
       mv envAPIkey .env


4. **Prisma DB:** 

- **View and debug the database:** Run `npx prisma studio` to open a visual database browser
- **Modify the schema:** Edit `prisma/schema.prisma` to add/change models and fields
- **Apply schema changes:** After modifying the schema, run `npx prisma migrate dev --name <migration_name>` (e.g., `npx prisma migrate dev --name add_user_table`)
- **Generate Prisma Client:** Run `npx prisma generate` to regenerate the client after schema changes
- **Seed the database:** Run `node prisma/seed.js` to populate the database with initial data
- **Reset the database:** Run `npx prisma migrate reset` to clear all data and re-run migrations and seeds
- **Fresh start:** Delete `prisma/dev.db` and run `npx prisma migrate dev` to recreate the database from scratch

**Common workflow:**
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe_your_change`
3. Run `npx prisma generate` (usually done automatically by migrate)
4. Update your seed file if needed (`prisma/seed.js`)
5. Run `node prisma/seed.js` to populate data
6. Use `npx prisma studio` to verify changes

**Seed file location:** `prisma/seed.js` - modify this file to change what data is seeded into your database on initialization.


