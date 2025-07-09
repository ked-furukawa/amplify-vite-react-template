import { useState } from 'react';
import InvoiceManagementSystem from './components/InvoiceManagementSystem';
import PurchaseManagementSystem from './components/PurchaseManagementSystem';
import './App.css';

function App() {
  const [activeSystem, setActiveSystem] = useState<'invoice' | 'purchase'>('invoice');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            {activeSystem === 'invoice' ? '納品・請求管理システム' : '仕入・支払管理システム'}
          </h1>
          <nav className="system-nav">
            <button 
              onClick={() => setActiveSystem('invoice')}
              className={`nav-button ${activeSystem === 'invoice' ? 'active invoice' : ''}`}
            >
              📋 納品・請求管理
            </button>
            <button 
              onClick={() => setActiveSystem('purchase')}
              className={`nav-button ${activeSystem === 'purchase' ? 'active purchase' : ''}`}
            >
              🛒 仕入・支払管理
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {activeSystem === 'invoice' && <InvoiceManagementSystem />}
        {activeSystem === 'purchase' && <PurchaseManagementSystem />}
      </main>
    </div>
  );
}

export default App;
