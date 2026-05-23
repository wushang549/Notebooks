function Header() {
  const features = [
    "Control de tono",
    "Reescritura profesional",
    "Explicacion de cambios",
  ];

  return (
    <header className="app-header">
      <div className="header-copy">
        <p className="brand-kicker">Asistente de escritura con IA</p>
        <h1>Draftly</h1>
        <p className="header-subtitle">
          Convierte mensajes en borrador en comunicacion clara y profesional.
        </p>
        <p className="header-description">
          Elige el tono, la intencion, el idioma y la audiencia. Draftly
          reescribe tu mensaje y explica que cambio.
        </p>
      </div>

      <div className="feature-strip" aria-label="Funciones de Draftly">
        {features.map((feature) => (
          <div className="feature-item" key={feature}>
            <span className="feature-marker" aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

export default Header;
