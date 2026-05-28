export default function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`toggle${checked ? ' on' : ''}`}
      onClick={() => onChange(!checked)}
    />
  )
}
