import { useRef, useState } from "react";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";

const mockResult = {
  improvedMessage: `Hola, espero que te encuentres muy bien.

Queria dar seguimiento a la posicion a la que postule. Agradeceria cualquier actualizacion que pudieras compartir sobre el estado del proceso.

Gracias por tu tiempo.`,
  analysis: {
    detectedTone: "Impaciente / informal",
    clarity: "Media",
    professionalism: "Baja-media",
    toneRisk: "Medio",
    summary:
      "El mensaje original comunica la idea, pero algunas frases pueden sonar impacientes o demasiado casuales para un contexto profesional.",
  },
  changes: [
    "Se reemplazo el lenguaje casual por un saludo mas profesional.",
    "Se eliminaron frases que podian sonar impacientes.",
    "La solicitud se hizo mas clara y respetuosa.",
    "Se ajusto el mensaje para un contexto con reclutador.",
  ],
};

const initialOptions = {
  tone: "Profesional",
  intent: "Dar seguimiento",
  language: "Mismo",
  length: "Normal",
};

function App() {
  const generationTimeoutRef = useRef(null);
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

  const handleGenerate = () => {
    if (!message.trim()) {
      setError("Por favor ingresa un mensaje primero.");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);
    setGeneratedOptions(options);

    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
    }

    generationTimeoutRef.current = window.setTimeout(() => {
      setResult(mockResult);
      setIsLoading(false);
      generationTimeoutRef.current = null;
    }, 1000);
  };

  const handleClear = () => {
    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
      generationTimeoutRef.current = null;
    }

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
