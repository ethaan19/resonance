export default function SongResults({ results, onSelect }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(28px, 5vw, 40px)' }}>
        <p className="font-meta" style={{ color: 'var(--gold)', opacity: 0.9, fontSize: 'clamp(9px, 2vw, 10px)' }}>Results</p>
        <span style={{ color: 'var(--text-dim)', fontSize: 'clamp(12px, 2vw, 13px)', letterSpacing: '0.2px' }}>
          {results.length} {results.length === 1 ? 'song' : 'songs'}
        </span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--divider-dim), transparent)', marginLeft: 8 }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(160px, 45vw, 240px), 1fr))',
        gap: 'clamp(12px, 3vw, 18px)',
      }}>
        {results.map((s, i) => (
          <SongCard key={s.id} song={s} onSelect={onSelect} delay={i} />
        ))}
      </div>
    </div>
  )
}

function SongCard({ song, onSelect, delay }) {
  return (
    <button
      onClick={() => onSelect(song)}
      className={`song-card animate-fade-in-${Math.min(delay + 1, 6)}`}
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        padding: 0,
        transition: 'border-color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--divider)'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* VU bar */}
      <div className="vu-bar" />

      {/* Album art — 75% of card */}
      <div style={{ position: 'relative', paddingBottom: '75%', background: 'var(--midnight3)', overflow: 'hidden' }}>
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt={song.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-dim)', fontSize: 36,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
        )}
        {/* Gradient overlay at bottom of image */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Metadata */}
      <div style={{ padding: 'clamp(10px, 2vw, 12px) clamp(10px, 2.5vw, 14px) clamp(10px, 2vw, 14px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="font-meta" style={{ color: 'var(--gold)', marginBottom: 'clamp(3px, 1vw, 5px)', opacity: 0.75, fontSize: 'clamp(7.5px, 2vw, 8.5px)' }}>Song</p>
        <p style={{
          fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 600, color: 'var(--text)',
          lineHeight: 1.3, marginBottom: 'clamp(2px, 1vw, 4px)', letterSpacing: '0.1px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          flex: 1,
        }}>
          {song.title}
        </p>
        <p style={{
          fontSize: 'clamp(10px, 1.5vw, 11px)', color: 'var(--text-muted)', letterSpacing: '0.2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {song.artist}
        </p>
      </div>
    </button>
  )
}
