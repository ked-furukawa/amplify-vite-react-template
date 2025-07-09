import { useState } from 'react';
import InvoiceManagementSystem from './components/InvoiceManagementSystem';
import PurchaseManagementSystem from './components/PurchaseManagementSystem';

// App styles
const appStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
  }

  #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
  }

  .app-header {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
  }

  .app-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }

  .system-nav {
    display: flex;
    gap: 0.5rem;
  }

  .nav-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    background: #e9ecef;
    color: #6c757d;
  }

  .nav-button:hover {
    background: #dee2e6;
  }

  .nav-button.active {
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .nav-button.active.invoice {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .nav-button.active.purchase {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  }

  .app-main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    
    .app-title {
      font-size: 1.2rem;
    }
    
    .system-nav {
      flex-direction: column;
      width: 100%;
    }
    
    .nav-button {
      width: 100%;
    }
    
    .app-main {
      padding: 1rem;
    }
  }
`;

// Add styles to head
const styleElement = document.createElement('style');
styleElement.textContent = appStyles;
document.head.appendChild(styleElement);

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
