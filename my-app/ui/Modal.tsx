export default function EmptyState({ title = "Нічого не знайдено", subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 0" }}>
      <div
        style={{
          width: 48,
          height: 48,
          margin: "0 auto 8px",
          border: "1px solid #e5e7eb",
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🗞️
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ color: "#6b7280", marginTop: 6 }}>{subtitle}</p>}
    </div>
  );
}
