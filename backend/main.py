import os
import re
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="SongContext API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GENIUS_TOKEN = os.getenv("GENIUS_ACCESS_TOKEN", "")
GENIUS_BASE = "https://api.genius.com"

openai_client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY", ""),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", ""),
    api_version="2024-02-01",
)
DEPLOYMENT = os.getenv("AZURE_DEPLOYMENT_NAME", "gpt-4o-mini")

ANALYSIS_PROMPTS = {
    'es': """Eres un experto en análisis de canciones. Analiza esta canción y proporciona:

1. **Significado General**: ¿Qué tema principal trata?
2. **Contexto Histórico**: ¿Cuándo se escribió? ¿Qué pasaba en ese momento?
3. **Inspiración**: ¿Qué inspiró al artista?
4. **Análisis Lírico**: ¿Qué técnicas poéticas usa? ¿Hay metáforas importantes?
5. **Impacto Cultural**: ¿Cómo fue recibida? ¿Influyó en algo?

Sé conciso pero profundo (máx 300 palabras).

CANCIÓN: {song_name} - {artist}
LETRA (fragmento):
{lyrics}""",
    'en': """You are an expert song analyst. Analyze this song and provide:

1. **General Meaning**: What's the main theme?
2. **Historical Context**: When was it written? What was happening then?
3. **Inspiration**: What inspired the artist?
4. **Lyrical Analysis**: What poetic techniques are used? Important metaphors?
5. **Cultural Impact**: How was it received? Did it influence anything?

Be concise but deep (max 300 words).

SONG: {song_name} - {artist}
LYRICS (excerpt):
{lyrics}""",
    'fr': """Vous êtes expert en analyse de chansons. Analysez cette chanson et fournissez:

1. **Signification Générale**: Quel est le thème principal?
2. **Contexte Historique**: Quand a-t-elle été écrite? Qu'y avait-il à cette époque?
3. **Inspiration**: Qu'a inspiré l'artiste?
4. **Analyse Lyrique**: Quelles techniques poétiques sont utilisées? Métaphores importantes?
5. **Impact Culturel**: Comment a-t-elle été reçue? A-t-elle influencé quelque chose?

Soyez concis mais approfondi (max 300 mots).

CHANSON: {song_name} - {artist}
PAROLES (extrait):
{lyrics}""",
    'de': """Sie sind ein Experte für Songanalyse. Analysieren Sie diesen Song und liefern Sie:

1. **Allgemeine Bedeutung**: Was ist das Hauptthema?
2. **Historischer Kontext**: Wann wurde er geschrieben? Was war damals los?
3. **Inspiration**: Was inspirierte den Künstler?
4. **Lyrische Analyse**: Welche poetischen Techniken werden verwendet? Wichtige Metaphern?
5. **Kulturelle Auswirkungen**: Wie wurde er aufgenommen? Hat er etwas beeinflusst?

Sei prägnant, aber tief (max 300 Wörter).

LIED: {song_name} - {artist}
SONGTEXTE (Auszug):
{lyrics}""",
    'it': """Sei un esperto di analisi di canzoni. Analizza questa canzone e fornisci:

1. **Significato Generale**: Qual è il tema principale?
2. **Contesto Storico**: Quando è stata scritta? Cosa accadeva allora?
3. **Ispirazione**: Cosa ha ispirato l'artista?
4. **Analisi Lirica**: Quali tecniche poetiche usa? Metafore importanti?
5. **Impatto Culturale**: Come è stata accolta? Ha influenzato qualcosa?

Sii conciso ma profondo (max 300 parole).

CANZONE: {song_name} - {artist}
TESTO (estratto):
{lyrics}""",
    'pt': """Você é um especialista em análise de canções. Analise esta canção e forneça:

1. **Significado Geral**: Qual é o tema principal?
2. **Contexto Histórico**: Quando foi escrita? O que estava acontecendo?
3. **Inspiração**: O que inspirou o artista?
4. **Análise Lírica**: Quais técnicas poéticas são usadas? Metáforas importantes?
5. **Impacto Cultural**: Como foi recebida? Influenciou algo?

Seja conciso mas profundo (max 300 palavras).

CANÇÃO: {song_name} - {artist}
LETRA (trecho):
{lyrics}""",
    'ja': """あなたは音楽分析の専門家です。この曲を分析し、以下を提供してください:

1. **全般的な意味**: 主なテーマは何ですか?
2. **歴史的背景**: いつ書かれましたか? その時代は何が起きていましたか?
3. **インスピレーション**: アーティストに何がインスピレーションを与えましたか?
4. **歌詞分析**: どのような詩的技法が使われていますか? 重要な隠喩は?
5. **文化的影響**: どのように受け取られましたか? 何かに影響しましたか?

簡潔ですが深掘りしてください(最大300語)。

曲: {song_name} - {artist}
歌詞(抜粋):
{lyrics}""",
    'zh': """您是歌曲分析的专家。请分析这首歌曲并提供:

1. **总体意义**: 主要主题是什么?
2. **历史背景**: 何时写的? 当时发生了什么?
3. **灵感**: 什么激发了艺术家的灵感?
4. **歌词分析**: 使用了哪些诗歌技巧? 重要的隐喻?
5. **文化影响**: 它如何被接受? 它影响了什么?

简洁但深入(最多300字)。

歌曲: {song_name} - {artist}
歌词(摘录):
{lyrics}""",
}


class SearchRequest(BaseModel):
    song: str = ""
    artist: str = ""


class AnalyzeRequest(BaseModel):
    song_name: str
    artist: str
    lyrics: str = ""
    language: str = "es"


def extract_year(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    m = re.search(r'\b(19|20)\d{2}\b', text)
    return m.group() if m else None


def clean_lyrics(raw: str) -> str:
    # Remove [Verse], [Chorus] etc tags
    text = re.sub(r'\[.*?\]', '', raw)
    # Collapse multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def extract_lyrics_preview(full_lyrics: str, max_lines: int = 20) -> str:
    lines = [l for l in full_lyrics.splitlines() if l.strip()]
    return '\n'.join(lines[:max_lines])


@app.get("/")
def root():
    return {"status": "ok", "service": "SongContext API"}


@app.post("/search")
async def search(req: SearchRequest):
    query = f"{req.song} {req.artist}".strip()
    if not query:
        raise HTTPException(400, "Provide song or artist")

    if not GENIUS_TOKEN or GENIUS_TOKEN == "your_genius_access_token_here":
        # Return mock data for testing without credentials
        return {
            "results": [
                {
                    "id": 1,
                    "title": f"{req.song or 'Example Song'}",
                    "artist": req.artist or "Example Artist",
                    "thumbnail": None,
                    "year": "2020",
                    "genius_url": None,
                    "lyrics_preview": "These are example lyrics.\nAdd your GENIUS_ACCESS_TOKEN to get real results.\nBoth lines above are placeholder text.",
                }
            ]
        }

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GENIUS_BASE}/search",
            params={"q": query, "per_page": 10},
            headers={"Authorization": f"Bearer {GENIUS_TOKEN}"},
            timeout=10,
        )

    if resp.status_code != 200:
        raise HTTPException(502, f"Genius API error: {resp.status_code}")

    hits = resp.json().get("response", {}).get("hits", [])
    results = []
    for hit in hits:
        r = hit.get("result", {})
        artist_name = r.get("primary_artist", {}).get("name", "")
        thumbnail = r.get("song_art_image_thumbnail_url") or r.get("header_image_thumbnail_url")
        year = extract_year(str(r.get("release_date_components", "") or ""))
        results.append({
            "id": r.get("id"),
            "title": r.get("title", ""),
            "artist": artist_name,
            "thumbnail": thumbnail,
            "year": year,
            "genius_url": r.get("url"),
            "lyrics_preview": None,  # Fetched lazily — Genius scraping requires extra step
        })

    return {"results": results}


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.song_name:
        raise HTTPException(400, "song_name required")

    language = req.language if req.language in ANALYSIS_PROMPTS else "es"

    azure_key = os.getenv("AZURE_OPENAI_API_KEY", "")
    if not azure_key or azure_key == "your_azure_openai_key_here":
        return {
            "analysis": (
                "**Significado General**: Configure AZURE_OPENAI_API_KEY en backend/.env para obtener análisis reales.\n\n"
                "**Contexto Histórico**: Esta es una respuesta de ejemplo. El análisis real usará GPT-4o-mini via Azure OpenAI.\n\n"
                "**Inspiración**: Agrega tus credenciales de Azure OpenAI para desbloquear esta función.\n\n"
                "**Análisis Lírico**: El prompt enviará el título, artista y fragmento de letra al modelo.\n\n"
                "**Impacto Cultural**: Respuesta generada automáticamente en máximo 300 palabras."
            )
        }

    prompt_template = ANALYSIS_PROMPTS[language]
    prompt = prompt_template.format(
        song_name=req.song_name,
        artist=req.artist,
        lyrics=req.lyrics[:1500] if req.lyrics else "(sin letra disponible)",
    )

    try:
        response = openai_client.chat.completions.create(
            model=DEPLOYMENT,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.7,
        )
        analysis_text = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(502, f"Azure OpenAI error: {str(e)}")

    return {"analysis": analysis_text}
