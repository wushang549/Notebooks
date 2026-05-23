import { useEffect, useState } from "react";
import ResultCard from "./ResultCard.jsx";

function ResultsPanel({ result, isLoading, generatedOptions }) {
  const [copyLabel, setCopyLabel] = useState("Copiar mensaje");

  useEffect(() => {
    if (copyLabel !== "Copiado!") return undefined;

    const timeoutId = window.setTimeout(() => {
      setCopyLabel("Copiar mensaje");
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [copyLabel]);

  const handleCopy = async () => {
    if (!result?.improvedMessage) return;

    await navigator.clipboard.writeText(result.improvedMessage);
    setCopyLabel("Copiado!");
  };

  const generatedFor = generatedOptions
    ? [
        generatedOptions.tone,
        generatedOptions.intent,
        generatedOptions.language,
      ].join(" - ")
    : "";

  return (
    <section className="panel results-panel" aria-labelledby="results-title">
      <div className="section-heading">
        <p className="eyebrow">Resultados</p>
        <h2 id="results-title">Reescritura generada</h2>
      </div>

      {!result && !isLoading ? (
        <div className="empty-state">
          <img className="empty-logo" src="/logo.svg" alt="" aria-hidden="true" />
          <h3>Tu mensaje mejorado aparecera aqui</h3>
          <p>
            Ingresa un borrador, elige tus preferencias y genera una version
            pulida.
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="empty-state loading-state" aria-live="polite">
          <div className="loading-dot" />
          <h3>Generando tu mensaje mejorado</h3>
          <p>Aplicando tus preferencias de tono, intencion y audiencia.</p>
        </div>
      ) : null}

      {result && !isLoading ? (
        <div className="results-stack">
          <p className="generated-for">Generado para: {generatedFor}</p>

          <ResultCard title="Mensaje mejorado" className="message-card">
            <p className="improved-message">{result.improvedMessage}</p>
            <button
              className="secondary-button"
              type="button"
              onClick={handleCopy}
            >
              {copyLabel}
            </button>
          </ResultCard>

          <ResultCard title="Analisis del mensaje original">
            <dl className="analysis-list">
              <div className="metric-box">
                <dt>Tono detectado</dt>
                <dd>{result.analysis.detectedTone}</dd>
              </div>
              <div className="metric-box">
                <dt>Claridad</dt>
                <dd>{result.analysis.clarity}</dd>
              </div>
              <div className="metric-box">
                <dt>Profesionalismo</dt>
                <dd>{result.analysis.professionalism}</dd>
              </div>
              <div className="metric-box">
                <dt>Riesgo de tono</dt>
                <dd>{result.analysis.toneRisk}</dd>
              </div>
              <div className="summary-row">
                <dt>Resumen</dt>
                <dd>{result.analysis.summary}</dd>
              </div>
            </dl>
          </ResultCard>

          <ResultCard title="Cambios realizados">
            <ul className="changes-list">
              {result.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </ResultCard>
        </div>
      ) : null}
    </section>
  );
}

export default ResultsPanel;
