import SelectField from "./SelectField.jsx";

const selectGroups = [
  {
    label: "Tone",
    name: "tone",
    options: [
      "Professional",
      "Friendly",
      "Direct",
      "Firm",
      "Empathetic",
      "Formal",
      "Casual",
    ],
  },
  {
    label: "Intent",
    name: "intent",
    options: [
      "Follow up",
      "Request information",
      "Apologize",
      "Decline offer",
      "Accept offer",
      "Ask for meeting",
      "Give feedback",
      "Apply for job",
      "Respond to recruiter",
      "Escalate issue",
    ],
  },
  {
    label: "Language",
    name: "language",
    options: ["English", "Spanish", "English and Spanish"],
  },
  {
    label: "Length",
    name: "length",
    options: ["Very short", "Short", "Normal", "Detailed"],
  },
  {
    label: "Formality",
    name: "formality",
    options: ["Low", "Medium", "High"],
  },
  {
    label: "Recipient",
    name: "recipient",
    options: [
      "Recruiter",
      "Professor",
      "Manager",
      "Client",
      "Coworker",
      "Support team",
      "Company",
      "Unknown person",
    ],
  },
];

function MessageForm({
  message,
  options,
  error,
  isLoading,
  onMessageChange,
  onOptionChange,
  onGenerate,
}) {
  return (
    <form
      className="message-form"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <label className="field-group" htmlFor="original-message">
        <span>Original message</span>
        <textarea
          id="original-message"
          value={message}
          placeholder="Paste your rough message here..."
          onChange={(event) => onMessageChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "message-error" : undefined}
        />
      </label>

      {error ? (
        <p className="form-error" id="message-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="options-grid">
        {selectGroups.map((group) => (
          <SelectField
            key={group.name}
            label={group.label}
            name={group.name}
            value={options[group.name]}
            options={group.options}
            onChange={onOptionChange}
          />
        ))}
      </div>

      <button
        className="generate-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate improved message"}
      </button>
    </form>
  );
}

export default MessageForm;
