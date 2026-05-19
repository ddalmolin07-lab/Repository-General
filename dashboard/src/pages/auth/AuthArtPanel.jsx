// Pannello destro: l'immagine 3D dello scanner appoggiata sulla lavagna.
// mix-blend-mode: screen (definito in index.css su .auth-art-image)
// cancella il fondo scuro nativo del PNG senza editarlo.

export default function AuthArtPanel() {
  return (
    <aside className="auth-art-col" aria-hidden>
      <img
        src="/login-scanner.png"
        alt=""
        className="auth-art-image"
        draggable={false}
      />
    </aside>
  )
}
