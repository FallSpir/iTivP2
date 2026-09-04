import { useState, useEffect } from 'react';
import socket from '../socket';

export default function LiveFeed() {
  const [connected, setConnected] = useState(socket.connected);
  const [onlineCount, setOnlineCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [subscribedCategory, setSubscribedCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');

  function addNotification(text, type = 'info') {
    const item = { id: Date.now() + Math.random(), text, type, time: new Date().toLocaleTimeString('ru-RU') };
    setNotifications(prev => [item, ...prev].slice(0, 30));
  }

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('user_connected', ({ count }) => {
      setOnlineCount(count);
      addNotification('Пользователь подключился', 'connect');
    });

    socket.on('user_disconnected', ({ count }) => {
      setOnlineCount(count);
      addNotification('Пользователь отключился', 'disconnect');
    });

    socket.on('metric_created', (m) => {
      addNotification(`Добавлена метрика: ${m.name} (${m.category})`, 'create');
    });

    socket.on('metric_updated', (m) => {
      addNotification(`Обновлена метрика: ${m.name} (${m.category})`, 'update');
    });

    socket.on('metric_deleted', ({ name }) => {
      addNotification(`Удалена метрика: ${name}`, 'delete');
    });

    socket.on('joined_category', (cat) => {
      addNotification(`Подписка на категорию: ${cat}`, 'info');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.off('metric_created');
      socket.off('metric_updated');
      socket.off('metric_deleted');
      socket.off('joined_category');
    };
  }, []);

  function handleJoin(e) {
    e.preventDefault();
    if (!categoryInput.trim()) return;
    if (subscribedCategory) socket.emit('leave_category', subscribedCategory);
    socket.emit('join_category', categoryInput.trim());
    setSubscribedCategory(categoryInput.trim());
    setCategoryInput('');
  }

  function handleUnsubscribe() {
    if (subscribedCategory) {
      socket.emit('leave_category', subscribedCategory);
      setSubscribedCategory(null);
      addNotification('Отписка от категории', 'info');
    }
  }

  const typeColor = { connect: '#4caf50', disconnect: '#f44336', create: '#66bb6a', update: '#42a5f5', delete: '#ef5350', info: '#aaa' };

  return (
    <div className="live-feed">
      <div className="live-feed-header">
        <span className={`ws-dot ${connected ? 'ws-on' : 'ws-off'}`} />
        <span className="live-feed-title">Live Feed</span>
        <span className="live-feed-online">{onlineCount} онлайн</span>
      </div>

      <form className="live-feed-subscribe" onSubmit={handleJoin}>
        <input
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          placeholder="категория..."
        />
        <button type="submit">Подписаться</button>
        {subscribedCategory && (
          <button type="button" onClick={handleUnsubscribe} className="unsub-btn">
            ✕ {subscribedCategory}
          </button>
        )}
      </form>

      <div className="live-feed-list">
        {notifications.length === 0
          ? <p className="live-feed-empty">Ожидание событий...</p>
          : notifications.map(n => (
            <div key={n.id} className="live-feed-item">
              <span className="live-feed-dot" style={{ background: typeColor[n.type] }} />
              <span className="live-feed-text">{n.text}</span>
              <span className="live-feed-time">{n.time}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
