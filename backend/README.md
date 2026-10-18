# Price Tracker Backend

Endpoints
- GET /api/categories
- GET /api/products?q=&category=&subcategory=
- GET /api/products/:id

Run locally: `npm install && npm start` (http://localhost:4000)

Deploy on Render (free):
1. Push this repo to GitHub.
2. Render -> New -> Web Service -> pick repo, Root Directory = `backend`.
3. Build command `npm install`, Start command `npm start`, Instance type Free.
4. Copy the URL (https://xxxx.onrender.com) into app/src/config.js.
Note: free instances sleep after ~15 min idle; first request can take ~50s.
