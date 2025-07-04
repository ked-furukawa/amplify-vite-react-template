import { useAuthenticator } from '@aws-amplify/ui-react';
import InvoiceManagementSystem from './components/InvoiceManagementSystem';
import './App.css';

function App() {
  const { signOut } = useAuthenticator();

  return (
    <main>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <button 
          onClick={signOut}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Sign out
        </button>
      </div>
      <InvoiceManagementSystem />
    </main>
  );
}

export default App;
