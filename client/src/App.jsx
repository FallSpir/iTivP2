import { useState } from 'react';
import MetricList from './components/MetricList';
import Login from './components/Login';
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
    <div>
      <div className="top-bar">
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
      </div>
      <MetricList />
    </div>
  );
}
