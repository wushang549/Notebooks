function SelectField({ label, name, value, options, onChange }) {
  const id = `${name}-select`;

  return (
    <label className="field-group select-field" htmlFor={id}>
      <span>{label}</span>
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
    </label>
  );
}

export default SelectField;
