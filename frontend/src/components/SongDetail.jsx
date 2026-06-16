import { useState, useEffect } from 'react'
import React from 'react'
import ContextAnalyzer from './ContextAnalyzer'

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
]

export default function SongDetail({ song, onBack }) {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisLanguage, setAnalysisLanguage] = useState('es')

  useEffect(() => {
    if (!showAnalysis) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [showAnalysis])

  return (
    <div className="animate-fade-in" style={{ paddingTop: '0px' }}>

      {/* Back nav */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', fontSize: 'clamp(11px, 2vw, 12px)', fontFamily: 'inherit',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 'clamp(12px, 2vw, 16px)', padding: 0,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      {/* 2-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(clamp(240px, 30vw, 360px), 360px) 1fr',
        gap: 'clamp(32px, 6vw, 56px)',
        alignItems: 'start',
      }}
      className="detail-grid"
      >

        {/* ── Left column: art + meta ── */}
        <div className="anim-0">
          {/* Album art */}
          <div style={{
            position: 'relative',
            borderRadius: 'clamp(12px, 3vw, 18px)',
            overflow: 'hidden',
            background: 'var(--midnight3)',
            aspectRatio: '1',
            marginBottom: 'clamp(20px, 4vw, 32px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            border: '1px solid rgba(212,165,116,0.08)',
          }}>
            {song.thumbnail ? (
              <img
                src={song.thumbnail}
                alt={song.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-dim)',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
            )}
            {/* Subtle corner accent */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(to top, rgba(10,10,15,0.6), transparent)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Song info */}
          <p className="font-meta" style={{ color: 'var(--text-dim)', marginBottom: 10 }}>Song</p>

          <h2 className="font-display" style={{
            fontSize: 'clamp(22px, 5vw, 40px)',
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'var(--text)',
            lineHeight: 1.15,
            letterSpacing: 'clamp(-0.8px, -0.05vw, -0.8px)',
            marginBottom: 'clamp(8px, 2vw, 12px)',
          }}>
            {song.title}
          </h2>

          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.3px' }}>
            {song.artist}
          </p>

          {song.year && (
            <p className="font-meta" style={{ color: 'var(--text-dim)', marginBottom: 28 }}>
              {song.year}
            </p>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(to right, var(--divider), transparent)', marginBottom: 'clamp(20px, 4vw, 32px)' }} />

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 10px)' }}>
            {song.genius_url && (
              <a
                href={song.genius_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 20px',
                  border: '1px solid var(--divider)',
                  borderRadius: 9,
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  letterSpacing: '0.3px',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.color = 'var(--gold)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--divider)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View on Genius
              </a>
            )}

            {!showAnalysis && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
                <label style={{
                  display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)',
                }}>
                  <span className="font-meta" style={{ color: 'var(--gold)', opacity: 0.85, fontSize: 'clamp(9px, 2vw, 10px)' }}>
                    Analysis language
                  </span>
                  <select
                    value={analysisLanguage}
                    onChange={e => setAnalysisLanguage(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--divider)',
                      borderRadius: 8,
                      padding: 'clamp(9px, 2vw, 12px)',
                      color: 'var(--text)',
                      fontSize: 'clamp(12px, 2vw, 13px)',
                      fontFamily: 'inherit',
                      letterSpacing: '0.3px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      outline: 'none',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--gold)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,165,116,0.08)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'var(--divider)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} style={{ background: 'var(--midnight3)', color: 'var(--text)' }}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={() => setShowAnalysis(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)',
                    border: 'none',
                    borderRadius: 9,
                    background: 'var(--gold)',
                    color: '#0a0a0f',
                    fontSize: 'clamp(12px, 2vw, 13px)',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,165,116,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                  Analyze with AI
                </button>
              </div>
            )}
          </div>

          {/* Lyrics preview */}
          {song.lyrics_preview && (
            <div style={{ marginTop: 36 }}>
              <p className="font-meta" style={{ color: 'var(--text-dim)', marginBottom: 16 }}>Excerpt</p>
              <pre style={{
                fontFamily: 'inherit',
                fontSize: 13,
                lineHeight: 1.85,
                color: 'var(--text-dim)',
                whiteSpace: 'pre-wrap',
                margin: 0,
                borderLeft: '2px solid var(--divider)',
                paddingLeft: 16,
                letterSpacing: '0.3px',
              }}>
                {song.lyrics_preview}
              </pre>
            </div>
          )}
        </div>

        {/* ── Right column: analysis ── */}
        <div className="anim-1" style={{ minWidth: 0 }}>
          {!showAnalysis ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 320,
              border: '1px dashed var(--divider)',
              borderRadius: 14,
              padding: 'clamp(32px, 6vw, 48px)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 'clamp(40px, 10vw, 48px)', height: 'clamp(40px, 10vw, 48px)', borderRadius: 'clamp(10px, 2vw, 12px)',
                background: 'var(--gold-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'clamp(14px, 3vw, 20px)',
              }}>
                <svg width="clamp(18px, 4vw, 22px)" height="clamp(18px, 4vw, 22px)" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <p className="font-meta" style={{ color: 'var(--gold)', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(9px, 2vw, 10px)' }}>AI Analysis</p>
              <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(12px, 2vw, 14px)', lineHeight: 1.7, maxWidth: 280, letterSpacing: '0.3px' }}>
                Select language and press "Analyze with AI" to discover the history, inspiration, and meaning of this song.
              </p>
            </div>
          ) : (
            <ContextAnalyzer song={song} language={analysisLanguage} />
          )}
        </div>
      </div>

      {/* Responsive style injected inline */}
      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 5vw, 32px) !important;
          }
        }

        @media (max-width: 480px) {
          .detail-grid {
            gap: clamp(20px, 4vw, 24px) !important;
          }
        }
      `}</style>
    </div>
  )
}
