import { useState } from 'react';

export default function PropDrillingDemo() {
  const [userName, setUserName] = useState('admin');

  return (
    <div className="pd-demo">
      <div className="pd-controls">
        <span className="pd-label">Текущий пользователь:</span>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setUserName(n => n === 'admin' ? 'user' : 'admin')}
        >
          {userName} — сменить
        </button>
      </div>

      <div className="pd-columns">
        {/* ── Prop Drilling (проблема) ── */}
        <div className="pd-column">
          <div className="pd-col-title pd-col-bad">❌ Prop Drilling</div>
          <div className="pd-node pd-node-pass">
            <span className="pd-comp">App</span>
            <code className="pd-code">userName=&quot;{userName}&quot;</code>
            <div className="pd-arrow">↓ передаёт пропс</div>
            <div className="pd-node pd-node-pass">
              <span className="pd-comp">Header</span>
              <span className="pd-unused">не использует ⚠️</span>
              <div className="pd-arrow">↓ передаёт пропс</div>
              <div className="pd-node pd-node-pass">
                <span className="pd-comp">Navigation</span>
                <span className="pd-unused">не использует ⚠️</span>
                <div className="pd-arrow">↓ передаёт пропс</div>
                <div className="pd-node pd-node-pass">
                  <span className="pd-comp">UserMenu</span>
                  <span className="pd-unused">не использует ⚠️</span>
                  <div className="pd-arrow">↓ передаёт пропс</div>
                  <div className="pd-node pd-node-used">
                    <span className="pd-comp">UserAvatar</span>
                    <span className="pd-result">Привет, {userName}! 👋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Context API (решение) ── */}
        <div className="pd-column">
          <div className="pd-col-title pd-col-good">✅ Context API</div>
          <div className="pd-node pd-node-ctx-root">
            <span className="pd-comp">UserContext.Provider</span>
            <code className="pd-code">value=&#123;&#123; userName: &quot;{userName}&quot; &#125;&#125;</code>
            <div className="pd-arrow">↓</div>
            <div className="pd-node pd-node-ctx">
              <span className="pd-comp">Header</span>
              <span className="pd-skip">пропсы не нужны ✓</span>
              <div className="pd-arrow">↓</div>
              <div className="pd-node pd-node-ctx">
                <span className="pd-comp">Navigation</span>
                <span className="pd-skip">пропсы не нужны ✓</span>
                <div className="pd-arrow">↓</div>
                <div className="pd-node pd-node-ctx">
                  <span className="pd-comp">UserMenu</span>
                  <span className="pd-skip">пропсы не нужны ✓</span>
                  <div className="pd-arrow">↓</div>
                  <div className="pd-node pd-node-ctx-used">
                    <span className="pd-comp">UserAvatar</span>
                    <code className="pd-code pd-code-sm">useContext(UserContext)</code>
                    <span className="pd-result">Привет, {userName}! 👋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
