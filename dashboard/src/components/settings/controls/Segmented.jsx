import { useLayoutEffect, useRef, useState } from 'react'

export default function Segmented({ options, value, onChange }) {
  const containerRef = useRef(null)
  const itemsRef = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const active = itemsRef.current[value]
    if (active) {
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
    }
  }, [value, options])

  return (
    <div className="segmented" ref={containerRef}>
      <div
        className="seg-indicator"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          ref={(el) => { itemsRef.current[opt.value] = el }}
          className={`seg-item${opt.value === value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
