# 🎵 Resonance

Una aplicación web minimalista para buscar canciones y entender su contexto cultural mediante IA.

![Stack](https://img.shields.io/badge/React_18-Vite-blue) ![Stack](https://img.shields.io/badge/FastAPI-Python_3.13-green) ![Stack](https://img.shields.io/badge/Azure_OpenAI-GPT--4o--mini-orange)

[Read in English 🇬🇧](../README.md)

---

## Qué hace

1. **Búsqueda** — Introduce el título de una canción y/o el artista. Obtiene resultados de la API de Genius con la portada del álbum, el título y el artista.
2. **Vista de canción** — Haz clic en un resultado para ver la portada del álbum, los metadatos y un fragmento de la letra.
3. **Análisis por IA** — Haz clic en "Entender esta canción" para obtener un desglose de GPT-4o-mini que cubre:
   - Significado general
   - Contexto histórico
   - Inspiración del artista
   - Técnicas líricas y metáforas
   - Impacto cultural

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.13, Uvicorn |
| Letras | API de Genius |
| IA | Azure OpenAI (GPT-4o-mini) |

---

## Estructura del proyecto

```
song-translator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # Entradas de búsqueda controladas con botones para limpiar
│   │   │   ├── SongResults.jsx     # Cuadrícula de miniaturas con los resultados de búsqueda
│   │   │   ├── SongDetail.jsx      # Portada del álbum + vista previa de letras + navegación atrás
│   │   │   └── ContextAnalyzer.jsx # Panel de análisis de IA (se carga automáticamente al abrir)
│   │   ├── App.jsx                 # Estado raíz, enrutamiento entre vistas
│   │   └── index.css               # Variables CSS, animaciones, estilos globales
│   ├── .env.local                  # Variables de entorno del frontend
│   └── vite.config.js
└── backend/
    ├── main.py                     # Aplicación FastAPI: endpoints /search y /analyze
    ├── requirements.txt
    └── .env                        # Secretos del backend
```

---

## Configuración local

### Prerrequisitos

- Node.js 18 o superior
- Python 3.13
- Un token de acceso de [cliente de la API de Genius](https://genius.com/api-clients)
- Un recurso de Azure OpenAI con un despliegue de `gpt-4o-mini`

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Completa el archivo `backend/.env`:

```env
GENIUS_ACCESS_TOKEN=tu_token_aqui
AZURE_OPENAI_API_KEY=tu_clave_aqui
AZURE_OPENAI_ENDPOINT=https://tu-recurso.openai.azure.com/
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
```

Inicia el servidor:

```bash
uvicorn main:app --reload
# Se ejecuta en http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
```

`frontend/.env.local` está preconfigurado para el desarrollo local:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Inicia el servidor de desarrollo:

```bash
npm run dev
# Se ejecuta en http://localhost:5173
```

> **¿No tienes credenciales?** Ambos endpoints devuelven respuestas simuladas (mock) automáticamente, por lo que la interfaz es totalmente utilizable sin claves de API.

---

## Endpoints de la API

### `POST /search`

Busca canciones en Genius.

**Petición:**
```json
{ "song": "Papaoutai", "artist": "Stromae" }
```

**Respuesta:**
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

Analiza una canción con GPT-4o-mini.

**Petición:**
```json
{
  "song_name": "Papaoutai",
  "artist": "Stromae",
  "lyrics": "Tout le monde sait comment on fait les bébés..."
}
```

**Respuesta:**
```json
{
  "analysis": "**Significado General**: ..."
}
```

---

## Despliegue

### Backend → Railway

1. Sube la carpeta `backend/` a un repositorio de GitHub (o monorrepósito).
2. Crea un nuevo proyecto en Railway, conecta el repositorio y establece la raíz en `backend/`.
3. Añade las variables de entorno de `backend/.env` en la pestaña Variables de Railway.
4. Railway detectará automáticamente `requirements.txt` y ejecutará `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend → Vercel

1. Importa el repositorio en Vercel y establece la raíz en `frontend/`.
2. Añade `VITE_API_BASE_URL=https://tu-url-de-railway.railway.app` en las Variables de Entorno de Vercel.
3. Despliega. Vercel gestiona las compilaciones de Vite de forma automática.

---

## Referencia de variables de entorno

| Archivo | Variable | Descripción |
|---|---|---|
| `backend/.env` | `GENIUS_ACCESS_TOKEN` | Token de acceso OAuth2 para la API de Genius |
| `backend/.env` | `AZURE_OPENAI_API_KEY` | Clave del recurso Azure OpenAI |
| `backend/.env` | `AZURE_OPENAI_ENDPOINT` | `https://<recurso>.openai.azure.com/` |
| `backend/.env` | `AZURE_DEPLOYMENT_NAME` | Nombre del despliegue (ej. `gpt-4o-mini`) |
| `frontend/.env.local` | `VITE_API_BASE_URL` | URL base del backend (sin barra diagonal al final) |
