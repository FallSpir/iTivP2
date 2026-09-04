import { useState } from 'react';
import MetricList from './components/MetricList';
import Login from './components/Login';
import LiveFeed from './components/LiveFeed';
import './App.css';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthed(false);
  }

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="app-layout">
      <div className="top-bar">
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
      </div>
      <div className="app-body">
        <div className="app-main">
          <MetricList />
        </div>
        <div className="app-sidebar">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}
