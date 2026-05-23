import { useEffect, useState } from "react";
import ResultCard from "./ResultCard.jsx";

function ResultsPanel({ result, isLoading }) {
  const [copyLabel, setCopyLabel] = useState("Copy message");

  useEffect(() => {
    if (copyLabel !== "Copied!") return undefined;

    const timeoutId = window.setTimeout(() => {
      setCopyLabel("Copy message");
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [copyLabel]);

  const handleCopy = async () => {
    if (!result?.improvedMessage) return;

    await navigator.clipboard.writeText(result.improvedMessage);
    setCopyLabel("Copied!");
  };

  return (
    <section className="panel results-panel" aria-labelledby="results-title">
      <div className="section-heading">
        <p className="eyebrow">Results</p>
        <h2 id="results-title">Generated rewrite</h2>
      </div>

      {!result && !isLoading ? (
        <div className="empty-state">
          <h3>Your improved message will appear here</h3>
          <p>
            Enter a message, choose your preferences, and generate a polished
            version.
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="empty-state loading-state" aria-live="polite">
          <div className="loading-dot" />
          <h3>Generating your improved message</h3>
          <p>Applying your tone, intent, and audience preferences.</p>
        </div>
      ) : null}

      {result && !isLoading ? (
        <div className="results-stack">
          <ResultCard title="Improved Message" className="message-card">
            <p className="improved-message">{result.improvedMessage}</p>
            <button className="secondary-button" type="button" onClick={handleCopy}>
              {copyLabel}
            </button>
          </ResultCard>

          <ResultCard title="Original Message Analysis">
            <dl className="analysis-list">
              <div>
                <dt>Detected tone</dt>
                <dd>{result.analysis.detectedTone}</dd>
              </div>
              <div>
                <dt>Clarity</dt>
                <dd>{result.analysis.clarity}</dd>
              </div>
              <div>
                <dt>Professionalism</dt>
                <dd>{result.analysis.professionalism}</dd>
              </div>
              <div className="summary-row">
                <dt>Summary</dt>
                <dd>{result.analysis.summary}</dd>
              </div>
            </dl>
          </ResultCard>

          <ResultCard title="Changes Made">
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
