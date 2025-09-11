import { useState } from "react";

export default function Dashboard() {
  // Fake sales stats (replace with backend data later)
  const [stats] = useState({
    totalSales: 120,
    revenue: 54000,
    topProduct: "Nike Air Jordan 1 Retro",
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Aglet Dashboard</h1>
        <p style={styles.subtitle}>Shoe Resale POS System</p>
      </header>

      {/* Stats Section */}
      <section style={styles.statsGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Total Sales</h2>
          <p style={styles.cardValue}>{stats.totalSales}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Revenue</h2>
          <p style={styles.cardValue}>₱{stats.revenue.toLocaleString()}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top Product</h2>
          <p style={styles.cardValue}>{stats.topProduct}</p>
        </div>
      </section>

      {/* Quick Links */}
      <section style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.linksGrid}>
          <button style={styles.linkBtn}>➕ New Sale</button>
          <button style={styles.linkBtn}>📦 Manage Inventory</button>
          <button style={styles.linkBtn}>📊 View Reports</button>
          <button style={styles.linkBtn}>⚙ Settings</button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    color: "#222",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    marginTop: "0.25rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "1rem",
    color: "#777",
    marginBottom: "0.5rem",
  },
  cardValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  quickLinks: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
  },
  linksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
  },
  linkBtn: {
    padding: "1rem",
    borderRadius: "10px",
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
