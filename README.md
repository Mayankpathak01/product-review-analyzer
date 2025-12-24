# 🛍️ Product Review Analyzer (MVP)

Analyze e-commerce product reviews instantly using AI to make smarter buying decisions.

---

## 🔗 Live Demo

- **Frontend (Live App):** https://product-review-analyzer-nine.vercel.app/
- **Backend API:** https://product-review-analyzer-jso0.onrender.com

---

## ✨ Features

- **Instant Analysis** – Paste an Amazon / e-commerce product URL to analyze reviews
- **AI Sentiment Insights** – Detects Positive, Negative, and Neutral sentiment
- **Pros & Cons Extraction** – Identifies key strengths and weaknesses
- **Data Visualization** – View review trends and keyword insights
- **Report Export** – Download complete analysis in JSON format

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS  
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js  
- Deployed on **Render**

### AI Engine
- Google Gemini API (Generative AI)

### Web Scraping
- Cheerio
- Axios

---

## 📁 Project Structure

```
product-review-analyzer/
│
├── backend/
│   ├── server.js        # Express server & API routes
│   └── aiLogic.js       # Gemini AI integration
│
├── frontend/
│   └── src/
│       └── App.jsx      # UI & API integration
│
├── .gitignore           # Security configuration
└── README.md
```
---

## ⚙️ Installation & Local Setup

### 1️⃣ Prerequisites
- Node.js installed
- Google Gemini API Key from Google AI Studio

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```
Create a .env file in the backend folder:
```
GEMINI_API_KEY=your_actual_key_here       #Paste your gemini api key there
```
Run the backend server:
```
node server.js
```
---
3️⃣ Frontend Setup
```
cd frontend
npm install
```
Create a .env file in the frontend folder:
```
VITE_API_URL=http://localhost:5000    
```
Run the frontend:
```
npm run dev
```
---
🔐 Security & Configuration

API keys are stored securely using environment variables

.env and node_modules are excluded via .gitignore

CORS configured to allow requests only from the Vercel frontend
---
⚠️ Important Note

The backend is hosted on Render Free Tier.
If the app has been inactive, the first request may take 30–60 seconds due to cold start behavior.
---


