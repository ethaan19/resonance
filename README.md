**[🇪🇸 Leer en español](documentation/README.md)**

# 🎵 Resonance

A minimalist web app to search songs and understand their cultural context using AI.

![Stack](https://img.shields.io/badge/React_18-Vite-blue) ![Stack](https://img.shields.io/badge/FastAPI-Python_3.13-green) ![Stack](https://img.shields.io/badge/Azure_OpenAI-GPT--4o--mini-orange)

---

### **APP:** https://resonance-eta-one.vercel.app/

---

## What it does

1. **Search** — Enter a song title and/or artist. Pulls results from the Genius API with album art, title, and artist.
2. **Song view** — Click a result to see the album cover, metadata, and a lyrics preview.
3. **AI analysis** — Click "Entender esta canción" to get a GPT-4o-mini breakdown covering:
   - General meaning
   - Historical context
   - Artist inspiration
   - Lyric techniques and metaphors
   - Cultural impact

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.13, Uvicorn |
| Lyrics | Genius API |
| AI | Azure OpenAI (GPT-4o-mini) |

---

## Project structure

```
song-translator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # Controlled search inputs with clear buttons
│   │   │   ├── SongResults.jsx     # Thumbnail grid of search results
│   │   │   ├── SongDetail.jsx      # Album art + lyrics preview + back nav
│   │   │   └── ContextAnalyzer.jsx # AI analysis panel (auto-fetches on open)
│   │   ├── App.jsx                 # Root state, routing between views
│   │   └── index.css               # CSS variables, animations, global styles
│   ├── .env.local                  # Frontend env vars
│   └── vite.config.js
└── backend/
    ├── main.py                     # FastAPI app: /search and /analyze endpoints
    ├── requirements.txt
    └── .env                        # Backend secrets
```

---

## Local setup

### Prerequisites

- Node.js 18+
- Python 3.13
- A [Genius API client](https://genius.com/api-clients) access token
- An Azure OpenAI resource with a `gpt-4o-mini` deployment

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Fill in `backend/.env`:

```env
GENIUS_ACCESS_TOKEN=your_token_here
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
```

Start the server:

```bash
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
```

`frontend/.env.local` is pre-configured for local dev:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
# Runs on http://localhost:5173
```

> **No credentials?** Both endpoints return mock responses automatically, so the UI is fully usable without API keys.

---

## API endpoints

### `POST /search`

Search Genius for songs.

**Request:**
```json
{ "song": "Papaoutai", "artist": "Stromae" }
```

**Response:**
```json
{
  "results": [
    {
      "id": 123,
      "title": "Papaoutai",
      "artist": "Stromae",
      "thumbnail": "https://...",
      "year": "2013",
      "genius_url": "https://genius.com/...",
      "lyrics_preview": null
    }
  ]
}
```

### `POST /analyze`

Analyze a song with GPT-4o-mini.

**Request:**
```json
{
  "song_name": "Papaoutai",
  "artist": "Stromae",
  "lyrics": "Tout le monde sait comment on fait les bébés..."
}
```

**Response:**
```json
{
  "analysis": "**Significado General**: ..."
}
```

---

## Deployment

### Backend → Railway

1. Push the `backend/` folder to a GitHub repo (or monorepo).
2. Create a new Railway project, connect the repo, set root to `backend/`.
3. Add the env vars from `backend/.env` in Railway's Variables tab.
4. Railway auto-detects `requirements.txt` and runs `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend → Vercel

1. Import the repo in Vercel, set root to `frontend/`.
2. Add `VITE_API_BASE_URL=https://your-railway-url.railway.app` in Vercel's Environment Variables.
3. Deploy. Vercel handles Vite builds automatically.

---

## Environment variables reference

| File | Variable | Description |
|---|---|---|
| `backend/.env` | `GENIUS_ACCESS_TOKEN` | Genius API OAuth2 access token |
| `backend/.env` | `AZURE_OPENAI_API_KEY` | Azure OpenAI resource key |
| `backend/.env` | `AZURE_OPENAI_ENDPOINT` | `https://<resource>.openai.azure.com/` |
| `backend/.env` | `AZURE_DEPLOYMENT_NAME` | Deployment name (e.g. `gpt-4o-mini`) |
| `frontend/.env.local` | `VITE_API_BASE_URL` | Backend base URL (no trailing slash) |
