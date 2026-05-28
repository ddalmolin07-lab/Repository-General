import { useEffect, useRef, useState } from 'react'

export default function Slider({ value, onChange, min = 0, max = 100, suffix = '%' }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function pctFromEvent(e) {
    const rect = trackRef.current.getBoundingClientRect()
    const raw = ((e.clientX - rect.left) / rect.width) * (max - min) + min
    return Math.min(max, Math.max(min, Math.round(raw)))
  }

  function onPointerDown(e) {
    setDragging(true)
    onChange(pctFromEvent(e))
    trackRef.current.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragging) return
    onChange(pctFromEvent(e))
  }
  function onPointerUp() { setDragging(false) }

  useEffect(() => {
    if (!dragging) return
    function up() { setDragging(false) }
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [dragging])

  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="slider-wrap">
      <div
        ref={trackRef}
        className={`slider-track${dragging ? ' dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        <div className="slider-thumb" style={{ left: `${pct}%` }} />
        <div className="slider-tooltip" style={{ left: `${pct}%` }}>
          {value}{suffix}
        </div>
      </div>
      <div className="slider-value">{value}{suffix}</div>
    </div>
  )
}
