// Avatar deterministico: iniziali + colore derivato dall'hash del nome.
// Niente upload, niente Storage. Stabile su rerender.

const PALETTE = [
  ['#5975D6', '#7B91DD'], // brand blu
  ['#6E9D82', '#88B89C'], // verde muted
  ['#C5A65A', '#D6BC76'], // ocra
  ['#C57A5A', '#D69479'], // terracotta
  ['#8E6BB8', '#A88AD0'], // viola muted
  ['#5AA0C5', '#7BB8D6'], // azzurro
  ['#B85A7A', '#D07A94'], // rosa antico
  ['#5A8E8E', '#7AA8A8'], // teal
]

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function initialsFor(name = '', emailFallback = '') {
  const src = (name || '').trim() || (emailFallback || '').split('@')[0] || '?'
  const parts = src.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}

export default function InitialsAvatar({ name, email, size = 60 }) {
  const seed = (name || email || '?').toLowerCase()
  const [c1, c2] = PALETTE[hash(seed) % PALETTE.length]
  const initials = initialsFor(name, email)
  const fontSize = Math.round(size * 0.4)

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 800,
        color: '#fff',
        flexShrink: 0,
        boxShadow: `0 4px 18px ${c1}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
        letterSpacing: '-0.5px',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}
