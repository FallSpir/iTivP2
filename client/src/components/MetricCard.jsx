export default function MetricCard({ metric, onEdit, onDelete }) {
  const trendColor = metric.trend > 0 ? '#4caf50' : metric.trend < 0 ? '#f44336' : '#888';
  const trendSign = metric.trend > 0 ? '+' : '';

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-name">{metric.name}</span>
        <span className="metric-category">{metric.category}</span>
      </div>
      <div className="metric-value">
        {metric.value} <span className="metric-unit">{metric.unit}</span>
      </div>
      {metric.trend !== '' && metric.trend !== undefined && (
        <div className="metric-trend" style={{ color: trendColor }}>
          {trendSign}{metric.trend}%
        </div>
      )}
      <div className="metric-actions">
        <button onClick={() => onEdit(metric)}>Изменить</button>
        <button className="delete" onClick={() => onDelete(metric.id)}>Удалить</button>
      </div>
    </div>
  );
}
