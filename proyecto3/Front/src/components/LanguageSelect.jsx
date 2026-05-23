import { useEffect, useRef, useState } from "react";

function LanguageSelect({ label, name, value, options, optionIcons, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuDirection, setMenuDirection] = useState("down");
  const wrapperRef = useRef(null);
  const selectedIcon = optionIcons[value];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(name, option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const estimatedMenuHeight = Math.min(options.length * 42 + 12, 270);

      setMenuDirection(spaceBelow < estimatedMenuHeight ? "up" : "down");
    }

    setIsOpen((current) => !current);
  };

  return (
    <div className="field-group language-field" ref={wrapperRef}>
      <span>{label}</span>
      <div className="language-select">
        <button
          className={`language-trigger ${isOpen ? "is-open" : ""}`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          <span className="language-value">{value}</span>
          <img className="language-flag" src={selectedIcon} alt="" aria-hidden="true" />
          <span className="language-chevron" aria-hidden="true" />
        </button>

        {isOpen ? (
          <div
            className={`language-menu opens-${menuDirection}`}
            role="listbox"
            aria-label={label}
          >
            {options.map((option) => (
              <button
                className={`language-option ${
                  value === option ? "is-selected" : ""
                }`}
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>
                <img
                  className="language-flag"
                  src={optionIcons[option]}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LanguageSelect;
