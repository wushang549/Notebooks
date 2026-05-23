import { useState } from "react";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";

const initialOptions = {
  tone: "Profesional",
  intent: "Dar seguimiento",
  language: "Mismo",
  length: "Normal",
};

function App() {
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [result, setResult] = useState(null);
  const [generatedOptions, setGeneratedOptions] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (name, value) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!message.trim()) {
      setError("Por favor ingresa un mensaje primero.");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo generar el mensaje.");
      }

      setResult(data);
      setGeneratedOptions(options);
    } catch (requestError) {
      setResult(null);
      setGeneratedOptions(null);
      setError(
        requestError.message ||
          "Ocurrio un error al conectar con el generador."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setError("");
    setResult(null);
    setGeneratedOptions(null);
    setIsLoading(false);
  };

  return (
    <div className="app-shell">

      <main className="dashboard" aria-label="Area de trabajo de Draftly">
        <section className="panel form-panel" aria-labelledby="composer-title">
          <div className="section-heading">
            <p className="eyebrow">Redactor</p>
            <h2 id="composer-title">Crea el mensaje adecuado</h2>
            <p>
              Pega un borrador y personaliza como debe sonar el mensaje final.
            </p>
          </div>

          <MessageForm
            message={message}
            options={options}
            error={error}
            isLoading={isLoading}
            onMessageChange={(value) => {
              setMessage(value);
              if (error) setError("");
            }}
            onOptionChange={handleOptionChange}
            onGenerate={handleGenerate}
            onClear={handleClear}
          />
        </section>

        <ResultsPanel
          result={result}
          isLoading={isLoading}
          generatedOptions={generatedOptions}
        />
      </main>
    </div>
  );
}

export default App;
