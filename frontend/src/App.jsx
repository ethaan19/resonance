import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import SongResults from './components/SongResults'
import SongDetail from './components/SongDetail'

export default function App() {
  const [results, setResults] = useState([])
  const [selectedSong, setSelectedSong] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [song, setSong] = useState('')
  const [artist, setArtist] = useState('')

  const handleSearch = async (s, a) => {
    setLoading(true)
    setError(null)
    setSelectedSong(null)
    setHasSearched(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song: s, artist: a }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (e) {
      setError(e.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults([]); setSelectedSong(null); setHasSearched(false)
    setError(null); setSong(''); setArtist('')
  }

  useEffect(() => {
    if (!hasSearched) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [hasSearched])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ───────────────────────────── */}
      <header className="app-header" style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(58,58,74,0.3)',
        padding: '18px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}>
        <button
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, var(--purple), var(--gold))',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--text)', fontWeight: 500, letterSpacing: '-0.3px' }}>
            <em style={{ fontStyle: 'italic' }}>Re</em><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>sonance</em>
          </span>
        </button>

        {hasSearched && (
          <div className="header-search" style={{ maxWidth: 480, flex: 1, margin: '0 32px' }}>
            <SearchBar
              onSearch={handleSearch} loading={loading} compact
              song={song} setSong={setSong} artist={artist} setArtist={setArtist}
            />
          </div>
        )}
      </header>

      {/* ── Main ─────────────────────────────── */}
      <main style={{ flex: 1 }}>

        {/* Hero */}
        {!hasSearched && (
          <div style={{
            position: 'relative',
            height: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '7vh',
            backgroundImage: 'linear-gradient(135deg, rgba(107,79,161,0.08) 0%, rgba(212,165,116,0.04) 100%)',
            overflow: 'hidden',
          }}>
            {/* Decorative accents */}
            <div style={{
              position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            }} className="hero-accents">
              <div style={{
                position: 'absolute', top: '10%', right: '12%',
                width: 2, height: '65%',
                background: 'linear-gradient(to bottom, transparent, var(--gold-line), transparent)',
              }} />
              <div style={{
                position: 'absolute', bottom: '8%', left: '8%',
                width: '30%', height: 1.5,
                background: 'linear-gradient(to right, var(--purple-dim), transparent)',
              }} />
            </div>

            <div style={{ maxWidth: 1100, padding: '0 clamp(16px, 5vw, 40px)', width: '100%', position: 'relative', zIndex: 2 }}>
              <div style={{ maxWidth: 720 }}>
                <p className="font-meta anim-0" style={{ color: 'var(--gold)', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
                  Music with meaning
                </p>

                <div style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>
                  <h1 className="font-display-regular anim-1" style={{
                    fontSize: 'clamp(36px, 6vw, 96px)',
                    fontWeight: 500,
                    lineHeight: 1.08,
                    letterSpacing: 'clamp(-1.5px, -0.05vw, -1.5px)',
                    color: 'var(--text)',
                    marginBottom: 0,
                  }}>
                    Discover
                  </h1>
                  <h1 className="font-display anim-2" style={{
                    fontSize: 'clamp(36px, 6vw, 96px)',
                    fontWeight: 400,
                    lineHeight: 1.08,
                    letterSpacing: 'clamp(-1.5px, -0.05vw, -1.5px)',
                    color: 'var(--gold)',
                    marginBottom: 0,
                  }}>
                    the soul of every song
                  </h1>
                </div>

                <div className="anim-2" style={{
                  width: 3, height: 'clamp(40px, 10vw, 56px)',
                  background: 'linear-gradient(to bottom, var(--gold), var(--purple))',
                  marginBottom: 'clamp(24px, 4vw, 36px)',
                  borderRadius: 2,
                }} />

                <p className="anim-3" style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(14px, 3vw, 17px)',
                  lineHeight: 1.8,
                  letterSpacing: '0.35px',
                  maxWidth: 540,
                  marginBottom: 'clamp(36px, 7vw, 56px)',
                }}>
                  Discover history, cultural context, and artist inspiration in every song. Deep AI-powered analysis connecting you to true meaning.
                </p>

                <div className="anim-4">
                  <SearchBar
                    onSearch={handleSearch}
                    loading={loading}
                    song={song}
                    setSong={setSong}
                    artist={artist}
                    setArtist={setArtist}
                  />
                </div>

                <p className="anim-5" style={{ color: 'var(--text-dim)', fontSize: 'clamp(10px, 2vw, 11px)', marginTop: 'clamp(16px, 3vw, 24px)', letterSpacing: '0.5px' }}>
                  Powered by Genius API + Azure OpenAI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results view */}
        {hasSearched && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px, 5vw, 52px) clamp(16px, 5vw, 40px) clamp(48px, 8vw, 80px)' }}>

            {error && (
              <div className="animate-fade-in" style={{
                background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 10, padding: '14px 20px', color: '#e07070', fontSize: 13,
                marginBottom: 32, letterSpacing: '0.3px',
              }}>
                Search error: {error}
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 80, color: 'var(--text-muted)', fontSize: 13, letterSpacing: '0.4px' }}>
                <div className="spinner" style={{ width: 22, height: 22 }} />
                Searching...
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="animate-fade-in" style={{ paddingTop: 80 }}>
                <p className="font-meta" style={{ color: 'var(--text-dim)', marginBottom: 12 }}>No results</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try another song or artist name.</p>
              </div>
            )}

            {!loading && !selectedSong && results.length > 0 && (
              <SongResults results={results} onSelect={setSelectedSong} />
            )}

            {selectedSong && (
              <SongDetail song={selectedSong} onBack={() => setSelectedSong(null)} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
