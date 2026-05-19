import { useRef } from 'react'

export default function AuthButton({
  children,
  loading = false,
  loadingLabel = 'Attendere…',
  disabled = false,
  type = 'submit',
  onClick,
}) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      className="auth-submit"
    >
      {loading && <span className="auth-spinner" aria-hidden />}
      <span>{loading ? loadingLabel : children}</span>
    </button>
  )
}
