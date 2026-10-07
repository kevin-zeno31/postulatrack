function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div>
        <span className="stat-title">{title}</span>
        <strong className="stat-value">{value}</strong>
      </div>

      <div className="stat-icon">
        <Icon size={21} />
      </div>
    </div>
  );
}

export default StatCard;