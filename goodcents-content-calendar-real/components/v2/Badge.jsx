export default function Badge({ children, type }) {
  const className = String(type || children || '')
    .toLowerCase()
    .replaceAll('&', '')
    .replaceAll(' ', '-');

  return <span className={`badge ${className}`}>{children}</span>;
}
