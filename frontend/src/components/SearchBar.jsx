export default function SearchBar({ onSearch, loading, compact, song, setSong, artist, setArtist }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!song.trim() && !artist.trim()) return
    onSearch(song.trim(), artist.trim())
  }

  const inputBase = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--divider)',
    borderRadius: compact ? 8 : 10,
    padding: compact ? '9px 34px 9px 13px' : '12px 38px 12px 16px',
    color: 'var(--text)',
    fontSize: compact ? 13 : 14,
    letterSpacing: '0.3px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const wrapStyle = (flex) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex,
    minWidth: compact ? 110 : 140,
  })

  const ClearBtn = ({ value, onClear }) => (
    <button
      type="button"
      onClick={onClear}
      tabIndex={-1}
      style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
        color: 'var(--text-dim)',
        opacity: value ? 1 : 0,
        pointerEvents: value ? 'auto' : 'none',
        transition: 'opacity 0.15s, color 0.15s',
        display: 'flex', alignItems: 'center',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: compact ? 8 : 10, flexWrap: 'wrap', alignItems: 'center' }}>

        <div style={wrapStyle('2 1 160px')}>
          <input
            type="text"
            placeholder="Song..."
            value={song}
            onChange={e => setSong(e.target.value)}
            className="input-field"
            style={inputBase}
          />
          <ClearBtn value={song} onClear={() => setSong('')} />
        </div>

        <div style={wrapStyle('1.5 1 130px')}>
          <input
            type="text"
            placeholder="Artist..."
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="input-field"
            style={inputBase}
          />
          <ClearBtn value={artist} onClear={() => setArtist('')} />
        </div>

        <button
          type="submit"
          disabled={loading || (!song.trim() && !artist.trim())}
          style={{
            background: loading || (!song.trim() && !artist.trim())
              ? 'rgba(212,165,116,0.18)'
              : 'var(--gold)',
            color: loading || (!song.trim() && !artist.trim()) ? 'var(--gold)' : '#0a0a0f',
            border: '1px solid transparent',
            borderRadius: compact ? 8 : 10,
            padding: compact ? '9px 18px' : '12px 24px',
            fontSize: compact ? 13 : 14,
            fontWeight: 600,
            letterSpacing: '0.3px',
            cursor: loading || (!song.trim() && !artist.trim()) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 7,
            whiteSpace: 'nowrap',
            transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!loading && (song.trim() || artist.trim())) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,165,116,0.25)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading ? <span className="spinner" style={{ borderTopColor: 'var(--gold)' }} /> : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  )
}
