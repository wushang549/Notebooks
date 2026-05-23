function ResultCard({ title, children, className = "" }) {
  return (
    <article className={`result-card ${className}`}>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export default ResultCard;
