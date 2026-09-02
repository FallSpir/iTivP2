let metrics = [
  { id: 1, name: 'Revenue',          value: 125000, unit: 'USD',     category: 'finance',    timestamp: '2026-09-01T00:00:00Z' },
  { id: 2, name: 'DAU',              value: 4320,   unit: 'users',   category: 'engagement', timestamp: '2026-09-01T00:00:00Z' },
  { id: 3, name: 'Conversion Rate',  value: 3.7,    unit: '%',       category: 'sales',      timestamp: '2026-09-01T00:00:00Z' },
  { id: 4, name: 'Avg Order Value',  value: 89.5,   unit: 'USD',     category: 'finance',    timestamp: '2026-09-01T00:00:00Z' },
  { id: 5, name: 'Support Tickets',  value: 142,    unit: 'tickets', category: 'support',    timestamp: '2026-09-01T00:00:00Z' },
];

let nextId = 6;

function getAll() {
  return metrics;
}

function getById(id) {
  return metrics.find(m => m.id === id) || null;
}

function create(data) {
  const metric = { id: nextId++, ...data, timestamp: new Date().toISOString() };
  metrics.push(metric);
  return metric;
}

function update(id, data) {
  const index = metrics.findIndex(m => m.id === id);
  if (index === -1) return null;
  metrics[index] = { id, ...data, timestamp: new Date().toISOString() };
  return metrics[index];
}

function remove(id) {
  const index = metrics.findIndex(m => m.id === id);
  if (index === -1) return false;
  metrics.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
