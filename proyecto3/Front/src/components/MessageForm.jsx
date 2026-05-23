import LanguageSelect from "./LanguageSelect.jsx";
import SelectField from "./SelectField.jsx";

const languageIcons = {
  Mismo:
    "data:image/svg+xml,%3Csvg width='40' height='30' viewBox='0 0 40 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='30' rx='4' fill='%23EEF2FF'/%3E%3Ccircle cx='20' cy='15' r='9' stroke='%233157D6' stroke-width='2'/%3E%3Cpath d='M11 15H29M20 6C23 9 24.5 12 24.5 15C24.5 18 23 21 20 24C17 21 15.5 18 15.5 15C15.5 12 17 9 20 6Z' stroke='%233157D6' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E",
  Español: "https://flagcdn.com/w40/mx.png",
  Inglés: "https://flagcdn.com/w40/us.png",
  "Chino mandarín": "https://flagcdn.com/w40/cn.png",
  Hindi: "https://flagcdn.com/w40/in.png",
  Árabe: "https://flagcdn.com/w40/sa.png",
  Francés: "https://flagcdn.com/w40/fr.png",
  Bengalí: "https://flagcdn.com/w40/bd.png",
  Ruso: "https://flagcdn.com/w40/ru.png",
  Portugués: "https://flagcdn.com/w40/br.png",
  Urdu: "https://flagcdn.com/w40/pk.png",
};

const selectGroups = [
  {
    label: "Tono",
    name: "tone",
    options: [
      "Profesional",
      "Amigable",
      "Directo",
      "Firme",
      "Empático",
      "Diplomático",
      "Casual",
    ],
  },
  {
    label: "Intención",
    name: "intent",
    options: [
      "Dar seguimiento",
      "Solicitar información",
      "Disculparse",
      "Rechazar una oferta",
      "Aceptar una oferta",
      "Solicitar reunión",
      "Dar retroalimentación",
      "Postularme a un empleo",
      "Responder a reclutador",
      "Escalar un problema",
    ],
  },
  {
    label: "Idioma de salida",
    name: "language",
    options: [
      "Mismo",
      "Español",
      "Inglés",
      "Chino mandarín",
      "Hindi",
      "Árabe",
      "Francés",
      "Bengalí",
      "Ruso",
      "Portugués",
      "Urdu",
    ],
  },
  {
    label: "Longitud",
    name: "length",
    options: ["Muy breve", "Breve", "Normal", "Detallada"],
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
  onClear,
}) {
  const isMessageEmpty = !message.trim();

  return (
    <form
      className="message-form"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <label className="field-group" htmlFor="original-message">
        <span>Mensaje original</span>
        <textarea
          id="original-message"
          value={message}
          placeholder="Pega aqui tu mensaje en borrador..."
          onChange={(event) => onMessageChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "message-error" : undefined}
        />
      </label>

      <div className="textarea-footer">
        <span>{message.length} caracteres</span>
      </div>

      {error ? (
        <p className="form-error" id="message-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="options-grid">
        {selectGroups.map((group) =>
          group.name === "language" ? (
            <LanguageSelect
              key={group.name}
              label={group.label}
              name={group.name}
              value={options[group.name]}
              options={group.options}
              optionIcons={languageIcons}
              onChange={onOptionChange}
            />
          ) : (
            <SelectField
              key={group.name}
              label={group.label}
              name={group.name}
              value={options[group.name]}
              options={group.options}
              onChange={onOptionChange}
            />
          )
        )}
      </div>

      <div className="form-actions">
        <button
          className={`generate-button ${
            isMessageEmpty || isLoading ? "is-disabled" : ""
          }`}
          type="submit"
          disabled={isLoading}
          aria-disabled={isMessageEmpty || isLoading}
        >
          {isLoading ? "Generando..." : "Generar mensaje mejorado"}
        </button>
        <button
          className="clear-button"
          type="button"
          onClick={onClear}
          disabled={isLoading && isMessageEmpty}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
