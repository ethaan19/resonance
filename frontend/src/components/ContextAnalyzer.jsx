import { useState, useEffect } from 'react'

function parseAnalysis(text) {
  const stripNumber = (str) => str.replace(/^\d+\.\s*/, '').trim()
  const cleanContent = (str) => str.replace(/\*\*/g, '').replace(/\s+\d+\.\s*$/gm, '').trim()

  // Try ### N. Title style
  const hashSections = text.split(/^#{1,3}\s+/m).filter(Boolean)
  if (hashSections.length > 1) {
    return hashSections.map(block => {
      const newline = block.indexOf('\n')
      if (newline === -1) return null
      const title = stripNumber(block.slice(0, newline)).replace(/\*\*/g, '').trim()
      const content = cleanContent(block.slice(newline + 1))
      return title && content ? { title, content } : null
    }).filter(Boolean)
  }

  // Try **bold** style
  const sections = []
  const boldRegex = /\*\*([^*]+)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/g
  let match
  while ((match = boldRegex.exec(text)) !== null) {
    const title = stripNumber(match[1]).trim()
    const content = cleanContent(match[2])
    if (content) sections.push({ title, content })
  }
  return sections.length > 0 ? sections : null
}

export default function ContextAnalyzer({ song, language = 'es' }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            song_name: song.title,
            artist: song.artist,
            lyrics: song.lyrics_preview || '',
            language: language,
          }),
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setAnalysis(data.analysis)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [song, language])

  const sections = analysis ? parseAnalysis(analysis) : null

  return (
    <div style={{
      background: 'linear-gradient(155deg, rgba(107,79,161,0.04) 0%, rgba(212,165,116,0.02) 100%)',
      border: '1px solid var(--divider)',
      borderRadius: 'clamp(14px, 3vw, 18px)',
      padding: 'clamp(28px, 6vw, 40px) clamp(20px, 6vw, 42px)',
      transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
      boxShadow: analysis ? '0 0 0 1px rgba(212,165,116,0.06), 0 28px 80px rgba(0,0,0,0.5)' : 'none',
      borderColor: analysis ? 'rgba(212,165,116,0.12)' : 'var(--divider)',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 'clamp(24px, 5vw, 36px)' }}>
        <div style={{
          width: 'clamp(32px, 8vw, 38px)', height: 'clamp(32px, 8vw, 38px)', borderRadius: 'clamp(8px, 2vw, 10px)',
          background: 'linear-gradient(135deg, var(--purple), var(--gold))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="clamp(14px, 3vw, 16px)" height="clamp(14px, 3vw, 16px)" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p className="font-meta" style={{ color: 'var(--gold)', marginBottom: 'clamp(2px, 1vw, 3px)', opacity: 0.9, fontSize: 'clamp(9px, 2vw, 10px)' }}>Deep Analysis</p>
          <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: 'var(--text-muted)', letterSpacing: '0.2px', lineHeight: 1.4 }}>
            {song.title} <span style={{ color: 'var(--text-dim)' }}>—</span> {song.artist}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <div className="skeleton" style={{ height: 10, width: '30%', borderRadius: 4, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 8, width: '100%', borderRadius: 4, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 8, width: '85%', borderRadius: 4, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 8, width: '70%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(192,57,43,0.07)',
          border: '1px solid rgba(192,57,43,0.18)',
          borderRadius: 10, padding: '14px 18px',
          color: '#e07070', fontSize: 13, letterSpacing: '0.3px',
        }}>
          Analysis error: {error}
        </div>
      )}

      {/* Sections */}
      {analysis && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sections ? sections.map((sec, i) => (
            <div
              key={sec.title}
              className="section-reveal"
              style={{
                animationDelay: `${i * 0.1}s`,
                paddingBottom: 'clamp(20px, 4vw, 32px)',
                marginBottom: i < sections.length - 1 ? 'clamp(20px, 4vw, 32px)' : 0,
                borderBottom: i < sections.length - 1 ? '1px solid var(--divider-dim)' : 'none',
              }}
            >
              <p
                className="font-meta"
                style={{
                  color: 'var(--gold)',
                  marginBottom: 'clamp(10px, 2vw, 14px)',
                  opacity: 0.85,
                  fontSize: 'clamp(9px, 2vw, 10px)',
                  fontWeight: 600,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {sec.title}
              </p>

              <p
                style={{
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  lineHeight: 1.85,
                  color: 'var(--text)',
                  letterSpacing: '0.25px',
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {sec.content}
              </p>
            </div>
          )) : (
            <p
              style={{
                fontSize: 'clamp(13px, 2vw, 15px)',
                lineHeight: 1.85,
                color: 'var(--text)',
                whiteSpace: 'pre-wrap',
                letterSpacing: '0.25px',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {analysis}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
