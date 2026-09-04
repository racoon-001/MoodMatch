# 🎬 MoodMatch

> **Find what to watch based on how you feel.**

MoodMatch is an AI-powered movie and entertainment recommendation web app that transforms natural-language moods into personalized recommendations.

Instead of simply asking an AI to suggest movie titles, MoodMatch uses Gemini to understand the user's mood and converts it into structured signals such as **genre, tone, mood, and themes**. These signals are then processed by a custom recommendation and diversification engine before retrieving and ranking content from TMDB.

## 🌐 Live Demo

**[Try MoodMatch](https://moodmatch-fqaxlga5k-ishika-b77f.vercel.app/)**

### 📲 Install MoodMatch as a PWA

MoodMatch is a **Progressive Web App (PWA)** and can be installed like a native application on supported browsers.

1. Open the live MoodMatch website.
2. Use your browser's **Install** option.
3. Install MoodMatch on your device.
4. Launch it as a standalone app with the MoodMatch icon.

> 💡 On supported browsers, the **Install** option may appear in the browser's address bar or menu.

## ✨ Features

### 🤖 AI-Powered Mood Analysis

Describe how you feel in your own words and let Gemini analyze it.

For example:

> "I want something scary with ghosts and a creepy atmosphere."

MoodMatch converts the description into structured recommendation signals including:

- Genre
- Tone
- Mood
- Themes

The AI is used for **mood understanding**, while the actual recommendation ranking is handled by MoodMatch's own scoring engine.

### 🎯 Smart Recommendation Engine

Recommendations are ranked using multiple signals, including:

- Theme matching
- Title and synopsis relevance
- Tone matching
- Mood matching
- TMDB ratings
- Vote count
- Popularity

The system also applies a **smart diversification algorithm** to prevent the recommendation list from becoming repetitive.

It considers:

- Recommendation style
- Genre combinations
- Release-year groups
- Popularity tiers
- Repeated themes such as psychological, supernatural, mystery, horror/thriller, creature, and dark content

This balances **relevance with variety**.

### 🎬 Multiple Content Types

MoodMatch supports:

- 🎥 Movies
- 📺 Series
- 🇯🇵 Anime
- 🇰🇷 K-Dramas

Anime recommendations use Japanese original-language and animation filters, while K-Drama recommendations use Korean origin and language filtering.

### 🔎 TMDB Integration

MoodMatch retrieves content information from TMDB, including:

- Titles
- Posters
- Ratings
- Release years
- Genres
- Overviews
- Cast
- Directors
- Streaming availability

Multiple TMDB pages are fetched and duplicate results are removed before recommendations are ranked.

### 🎥 Detailed Movie & Series Information

Selecting a recommendation opens a detailed modal containing:

- Poster
- Backdrop
- Overview
- Genres
- Rating
- Release year
- Runtime / seasons / episodes
- Cast
- Director
- Streaming providers

Cast members are also clickable for quick web searches.

### 📺 Where to Watch

MoodMatch displays streaming availability for India, including available:

- Streaming services
- Free providers
- Rental providers
- Purchase providers

Provider information is sourced through TMDB's watch-provider data.

### ❤️ Personal Watchlist

Authenticated users can save movies and shows to a personal watchlist.

Watchlist functionality includes:

- Add to Watchlist
- Remove from Watchlist
- User-specific saved content
- Persistent storage
- Dedicated Watchlist section

### 🔐 Authentication

MoodMatch includes account functionality using Supabase:

- Sign up
- Login
- Logout
- Email verification support
- Persistent authentication sessions
- User-specific watchlists

Recommendation features are protected and require authentication.

### 📱 Responsive Design

The interface is designed for:

- Desktop
- Tablet
- Mobile

Mobile-specific improvements include:

- Hamburger navigation
- Responsive movie grids
- Touch-friendly controls
- Horizontal content filters
- Responsive AI mood input
- Mobile-friendly movie details modal
- Responsive authentication interface

### 📲 Progressive Web App

MoodMatch supports installation as a Progressive Web App.

The PWA includes:

- Installable application
- Custom app icons
- Standalone display mode
- Web App Manifest
- Service Worker
- App-shell caching
- Network-first loading strategy

API requests are intentionally excluded from the service-worker cache so recommendation and authentication data remains dynamic.

### ♿ Accessibility & UX

The interface includes additional accessibility and UX improvements such as:

- Visible keyboard focus states
- Smooth scrolling
- Clear active navigation states
- Disabled states during AI processing
- Loading skeletons
- Empty states
- Error states
- Consistent button sizing
- Responsive touch targets

---

## 🧠 How MoodMatch Works

```text
User describes their mood
          ↓
    Gemini AI analysis
          ↓
Genre + Tone + Mood + Themes
          ↓
Custom recommendation engine
          ↓
       TMDB API
          ↓
Content scoring
          ↓
Duplicate removal
          ↓
Smart diversification
          ↓
Personalized recommendations
```

The architecture separates **AI interpretation** from **recommendation generation**, allowing MoodMatch to maintain control over how results are scored and diversified.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive CSS
- Progressive Web App APIs

### Backend

- Node.js
- Vercel Serverless Functions
- REST-style API endpoints

### APIs & Services

- TMDB API
- Google Gemini API
- Supabase Authentication
- Supabase Database

### Deployment

- Git
- GitHub
- Vercel

---

## 📁 Project Structure

```text
MoodMatch/
│
├── api/
│   ├── details.js
│   ├── mood.js
│   ├── movies.js
│   ├── supabase.js
│   └── tmdb.js
│
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
│
├── index.html
├── style.css
├── script.js
├── manifest.json
├── sw.js
├── package.json
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### `POST /api/mood`

Analyzes a natural-language mood using Gemini.

Returns structured signals such as:

```text
Genre
Tone
Mood
Themes
```

A fallback classifier is available when Gemini cannot provide a valid response.

### `GET /api/movies`

Retrieves and ranks recommendations based on:

- Genre
- Content type
- Mood
- Tone
- Themes

Supported content types include:

```text
movie
series
anime
kdrama
```

### `GET /api/details`

Retrieves detailed information about a movie or TV series, including credits and India-specific watch providers.

### TMDB Helper

`api/tmdb.js` provides the server-side TMDB request layer and keyword-search functionality.

---

## 🔐 Environment Variables

Create a `.env` file for local development:

```env
TMDB_API_KEY=your_tmdb_api_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit `.env` or API credentials to GitHub.

For production, these values are configured through Vercel environment variables.

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/racoon-001/Miniproject2.git
cd Miniproject2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required credentials.

### 4. Start the Vercel development environment

```bash
npx vercel dev
```

This allows the frontend and serverless API endpoints to run together locally.

---

## ☁️ Deployment

MoodMatch is deployed using Vercel and connected to the GitHub repository.

Changes pushed to the `main` branch automatically trigger a new Vercel deployment.

Production deployment flow:

```text
Local changes
      ↓
     Git
      ↓
   GitHub
      ↓
   Vercel
      ↓
Production
```

---

## 🎨 Design

MoodMatch uses a custom **Midnight Magenta** visual theme.

### Color Palette

| Role | Color |
|---|---|
| Background | `#120C13` |
| Surface | `#21151F` |
| Primary | `#D946A8` |
| Primary Bright | `#F05BB5` |
| Secondary | `#F4C95D` |
| Tertiary | `#8FCB9B` |
| Text | `#F7EEF5` |
| Muted Text | `#B7A5B2` |

The interface uses dark surfaces, magenta highlights, warm gold accents, responsive cards, subtle animations, and glass-style navigation elements.

---

## 🛡️ Error Handling & Reliability

MoodMatch includes several reliability mechanisms:

- Input validation
- API error handling
- Gemini response validation
- Gemini fallback classification
- Retry handling for temporary Gemini errors
- TMDB request retries for retryable network failures
- Duplicate recommendation removal
- Invalid genre/content-type validation
- Empty recommendation states
- Loading states and skeletons

---

## 📌 Future Improvements

Potential future improvements include:

- GitHub Actions CI/CD workflow
- Automated tests
- Improved recommendation learning from watchlist behavior
- More advanced personalization
- Additional streaming platforms and regions
- Recommendation history
- Enhanced analytics

---

## 📚 Credits

Movie and TV metadata is provided by **TMDB**.

Streaming availability is provided through TMDB's watch-provider data.

Mood analysis is powered by **Google Gemini**.

Authentication and user watchlist storage are powered by **Supabase**.

---

## 👩‍💻 Author

**Ishika Harshyana**

Computer Science & Engineering

---

## 📄 License

This project is intended for educational and portfolio purposes.