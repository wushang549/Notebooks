import { useState } from "react";
import Header from "./components/Header.jsx";
import MessageForm from "./components/MessageForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";

const mockResult = {
  improvedMessage: `Hi, I hope you're doing well.

I wanted to follow up regarding the position I applied for. I would appreciate any update you could share about the status of the process.

Thank you for your time.`,
  analysis: {
    detectedTone: "Impatient / informal",
    clarity: "Medium",
    professionalism: "Low-medium",
    summary:
      "The original message communicates the idea, but some phrases may sound impatient or too casual for a professional context.",
  },
  changes: [
    "Replaced casual wording with a more professional greeting.",
    "Removed phrases that could sound impatient.",
    "Made the request clearer and more respectful.",
    "Adjusted the message for a recruiter context.",
  ],
};

const initialOptions = {
  tone: "Professional",
  intent: "Follow up",
  language: "English",
  length: "Normal",
  formality: "Medium",
  recipient: "Recruiter",
};

function App() {
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [result, setResult] = useState(null);
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
      setError("Please enter a message first.");
      setResult(null);
      return;
    }

    setError("");
    setIsLoading(true);

    window.setTimeout(() => {
      setResult(mockResult);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard" aria-label="ToneCraft AI workspace">
        <section className="panel form-panel" aria-labelledby="composer-title">
          <div className="section-heading">
            <p className="eyebrow">Composer</p>
            <h2 id="composer-title">Craft the right message</h2>
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
          />
        </section>

        <ResultsPanel result={result} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
