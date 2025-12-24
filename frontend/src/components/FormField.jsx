export default function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <small style={{ color: 'crimson' }}>{error}</small>}
    </div>
  );
}