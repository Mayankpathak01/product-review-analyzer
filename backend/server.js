require("dotenv").config();
const path = require('path');                 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing. Check your .env or Render env settings.");
  process.exit(1);
}
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

const systemPrompt = `You are an expert product review analyst. You will be given a list of raw customer reviews for a single product. Your job is to analyze all reviews and return a JSON object with the following structure. DO NOT return any text outside of the JSON object (e.g., no "Here is the JSON..." or \`json).

{
  "rating": "4.1" or "N/A",
  "totalReviews": 941,
  "overallSentiment": "Mostly Positive" | "Mixed" | "Mostly Negative" | "Neutral",
  "summary": "A 2-3 sentence summary of what customers think.",
  "keywords": [
    {"word": "Durable", "mentions": 25, "size": 32},
    {"word": "Battery Life", "mentions": 19, "size": 28},
    {"word": "Excellent", "mentions": 18, "size": 27},
    {"word": "Slow Support", "mentions": 15, "size": 25},
    {"word": "Expensive", "mentions": 12, "size": 22}
  ],
  "pros": [
    {"theme": "Build Quality", "percentage": 85, "description": "Customers consistently praise the solid metal build and durability."},
    {"theme": "Screen Quality", "percentage": 78, "description": "The OLED screen is bright, sharp, and a major highlight for users."}
  ],
  "cons": [
    {"theme": "Customer Support", "percentage": 30, "description": "A significant number of users reported slow or unhelpful customer support."},
    {"theme": "Software Bugs", "percentage": 22, "description": "Some users mentioned minor software glitches, though many were fixed in an update."}
  ],
  "topReviews": {
    "positive": [
      {"text": "This is the best product I've ever bought! The screen is amazing.", "rating": 5, "author": "Jane D.", "verified": true, "helpful": 12},
      {"text": "Incredibly durable and feels very premium. Battery lasts all day.", "rating": 5, "author": "Sam K.", "verified": true, "helpful": 8}
    ],
    "negative": [
      {"text": "Broke after one week. Customer support was useless. Do not buy.", "rating": 1, "author": "Mark P.", "verified": true, "helpful": 23},
      {"text": "The software is so buggy it's almost unusable. Very disappointed.", "rating": 2, "author": "Alex R.", "verified": false, "helpful": 14}
    ]
  },
  "ratingDistribution": [
    {"stars": 5, "percentage": 60},
    {"stars": 4, "percentage": 25},
    {"stars": 3, "percentage": 8},
    {"stars": 2, "percentage": 3},
    {"stars": 1, "percentage": 4}
  ],
  "insights": [
    {"topic": "Target Audience", "analysis": "This product is best suited for professionals and power users who need performance over portability."},
    {"topic": "Common Issues", "analysis": "The main complaints revolve around software bugs and poor customer support experiences."}
  ]
}
`;

async function callGeminiAPI(reviews) {
  console.log(`[AI] Sending ${reviews.length} reviews to Gemini API for analysis...`);

  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_GOES_HERE") {
    throw new Error("Invalid API Key: Please update GEMINI_API_KEY in server.js");
  }

  const userPrompt = `Here is the list of reviews: ${JSON.stringify(reviews)}`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const jsonText = response.data.candidates[0].content.parts[0].text;
    const structuredData = JSON.parse(jsonText);

    console.log("[AI] Successfully received and parsed AI analysis.");
    return structuredData;
  } catch (error) {
    console.error("[AI] Error calling Gemini API:", error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
      const aiError = error.response.data.error;
      throw new Error(`AI API Error: ${aiError.message}`);
    }
    throw new Error("Failed to communicate with the Gemini API.");
  }
}

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  console.log(`[SCRAPER] Received URL: ${url}`);

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    const $ = cheerio.load(html);
    const reviewSelector = '[data-hook="review-body"] span';
    const reviewElements = $(reviewSelector);

    console.log(`[SCRAPER] Found ${reviewElements.length} review elements using selector: ${reviewSelector}`);

    if (reviewElements.length === 0) {
      return res.status(404).json({ error: "Could not find any reviews. The selector is likely wrong or Amazon blocked us." });
    }

    const scrapedReviews = [];
    reviewElements.each((index, element) => {
      const reviewText = $(element).text().trim();
      if (reviewText) scrapedReviews.push(reviewText);
    });

    const analysisData = await callGeminiAPI(scrapedReviews.slice(0, 50));
    console.log("[SERVER] Success! Sending full analysis to frontend.");
    res.json(analysisData);

  } catch (error) {
    console.error("[SERVER] Error in /api/analyze route:", error.message);
    res.status(500).json({ error: error.message || "An unknown server error occurred." });
  }
});

// Serve frontend build (Render same-server)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// React fallback routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`[SERVER] Backend server is running on http://localhost:${port}`);
  console.log("Ready to receive requests from your React frontend!");
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_GOES_HERE") {
    console.warn("--- !!! ---");
    console.warn("[WARNING] You have not set your GEMINI_API_KEY in server.js!");
    console.warn("The app will not work until you add your API key.");
    console.warn("Get one from Google AI Studio.");
    console.warn("--- !!! ---");
  }
});
