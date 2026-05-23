function SelectField({ label, name, value, options, optionIcons, onChange }) {
  const id = `${name}-select`;
  const selectedIcon = optionIcons?.[value];

  return (
    <label
      className={`field-group select-field ${selectedIcon ? "has-icon" : ""}`}
      htmlFor={id}
    >
      <span>{label}</span>
      <div className="select-control">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {selectedIcon ? (
          <img className="select-icon" src={selectedIcon} alt="" aria-hidden="true" />
        ) : null}
      </div>
    </label>
  );
}

export default SelectField;
