import React, { useState } from 'react';
import { useInvoiceSystem } from '../hooks/useInvoiceSystem';

// Invoice Management System styles
const invoiceStyles = `
  .invoice-management-system {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .tabs {
    display: flex;
    background: white;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }

  .tab {
    flex: 1;
    padding: 15px 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 120px;
  }

  .tab:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }

  .tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  .content {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tab-content {
    width: 100%;
    animation: fadeIn 0.5s ease-in-out;
  }

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e9ecef;
  }

  .tab-header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .summary-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .summary-card {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    min-width: 150px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(116, 185, 255, 0.3);
  }

  .summary-card.alert {
    background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
    box-shadow: 0 4px 6px rgba(225, 112, 85, 0.3);
  }

  .summary-card h3 {
    margin: 0 0 10px 0;
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.9;
  }

  .summary-card .amount {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .table-container {
    overflow-x: auto;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
  }

  .data-table th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .data-table td {
    padding: 15px 12px;
    border-bottom: 1px solid #e9ecef;
    font-size: 0.9rem;
    vertical-align: middle;
  }

  .data-table tbody tr:hover {
    background: #f8f9fa;
    transform: scale(1.01);
    transition: all 0.2s ease;
  }

  .data-table tbody tr:last-child td {
    border-bottom: none;
  }

  .data-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }

  .data-table tbody tr:nth-child(even):hover {
    background: #e9ecef;
  }

  .status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    min-width: 70px;
    text-align: center;
  }

  .status-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .status-warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .status-danger {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .status-info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .status-default {
    background: #e2e3e5;
    color: #383d41;
    border: 1px solid #d6d8db;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 10px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    margin-right: 5px;
  }

  .btn-sm:last-child {
    margin-right: 0;
  }

  /* レスポンシブデザイン */
  @media (max-width: 768px) {
    .invoice-management-system {
      padding: 10px;
    }
    
    .header h1 {
      font-size: 2rem;
    }
    
    .tabs {
      flex-direction: column;
      gap: 10px;
    }
    
    .tab {
      flex: none;
      width: 100%;
    }
    
    .tab-header {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .summary-cards {
      flex-direction: column;
    }
    
    .summary-card {
      min-width: 100%;
    }
    
    .data-table {
      font-size: 0.8rem;
    }
    
    .data-table th,
    .data-table td {
      padding: 10px 8px;
    }
    
    .btn {
      padding: 8px 16px;
      font-size: 0.8rem;
    }
    
    .btn-sm {
      padding: 4px 8px;
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .header h1 {
      font-size: 1.5rem;
    }
    
    .content {
      padding: 20px;
    }
    
    .tab-header h2 {
      font-size: 1.5rem;
    }
    
    .data-table {
      font-size: 0.7rem;
    }
    
    .data-table th,
    .data-table td {
      padding: 8px 6px;
    }
    
    .btn {
      padding: 6px 12px;
      font-size: 0.7rem;
    }
    
    .btn-sm {
      padding: 4px 6px;
      font-size: 0.6rem;
    }
  }

  /* スクロールバーのスタイリング */
  .table-container::-webkit-scrollbar {
    height: 8px;
  }

  .table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* アニメーション */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tab-content {
    animation: fadeIn 0.5s ease-in-out;
  }

  /* フォーカス時のスタイル */
  .btn:focus,
  .tab:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  /* 印刷時のスタイル */
  @media print {
    .invoice-management-system {
      background: white;
      padding: 0;
    }
    
    .header {
      background: none;
      color: black;
      box-shadow: none;
    }
    
    .tabs {
      display: none;
    }
    
    .content {
      box-shadow: none;
    }
    
    .btn {
      display: none;
    }
  }
    border: 1px solid #ffeaa7;
  }

  .status-danger {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .status-info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .status-default {
    background: #e2e3e5;
    color: #383d41;
    border: 1px solid #d6d8db;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 10px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn:focus,
  .tab:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    margin-right: 5px;
  }

  .btn-sm:last-child {
    margin-right: 0;
  }

  .table-container::-webkit-scrollbar {
    height: 8px;
  }

  .table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .invoice-management-system {
      padding: 10px;
    }
    
    .header h1 {
      font-size: 2rem;
    }
    
    .tabs {
      flex-direction: column;
      gap: 10px;
    }
    
    .tab {
      flex: none;
      width: 100%;
    }
    
    .tab-header {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .summary-cards {
      flex-direction: column;
    }
    
    .summary-card {
      min-width: 100%;
    }
    
    .data-table {
      font-size: 0.8rem;
    }
    
    .data-table th,
    .data-table td {
      padding: 10px 8px;
    }
    
    .btn {
      padding: 8px 16px;
      font-size: 0.8rem;
    }
    
    .btn-sm {
      padding: 4px 8px;
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .header h1 {
      font-size: 1.5rem;
    }
    
    .content {
      padding: 20px;
    }
    
    .tab-header h2 {
      font-size: 1.5rem;
    }
    
    .data-table {
      font-size: 0.7rem;
    }
    
    .data-table th,
    .data-table td {
      padding: 8px 6px;
    }
    
    .btn {
      padding: 6px 12px;
      font-size: 0.7rem;
    }
    
    .btn-sm {
      padding: 4px 6px;
      font-size: 0.6rem;
    }
  }

  @media print {
    .invoice-management-system {
      background: white;
      padding: 0;
    }
    
    .header {
      background: none;
      color: black;
      box-shadow: none;
    }
    
    .tabs {
      display: none;
    }
    
    .content {
      box-shadow: none;
    }
    
    .btn {
      display: none;
    }
  }
`;

// Add styles to head
const styleElement = document.createElement('style');
styleElement.textContent = invoiceStyles;
document.head.appendChild(styleElement);

interface DeliveryData {
  id: string;
  companyName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  status: '発行済み' | '未発行';
}

interface InvoiceData {
  id: string;
  companyName: string;
  invoiceNumber: string;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: '発行済み' | '未発行';
}

interface AccountsReceivable {
  id: string;
  companyName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: '未入金' | '一部入金' | '入金済み' | '期限超過';
  overdueDays?: number;
}

interface PaymentData {
  id: string;
  date: string;
  amount: number;
  accountName: string;
  memo: string;
  status: '未照合' | '照合済み' | '手動対応';
}

const InvoiceManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'delivery' | 'invoice' | 'receivables' | 'payments'>('delivery');

  // 新しいHookを使用
  const {
    deliveryNotes,
    invoices,
    accountsReceivable,
    paymentRecords,
    companies,
    products,
    loading,
    error,
    getStats,
    updateDeliveryNote,
    updateInvoice,
    updateAccountsReceivable,
    updatePaymentRecord,
    matchPaymentRecord,
    clearError
  } = useInvoiceSystem();

  // 統計情報を取得
  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case '発行済み':
      case '照合済み':
      case '入金済み':
        return 'status-success';
      case '未発行':
      case '未入金':
      case '未照合':
        return 'status-warning';
      case '期限超過':
        return 'status-danger';
      case '一部入金':
        return 'status-info';
      default:
        return 'status-default';
    }
  };

  const renderDeliveryTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>納品書発行管理</h2>
        <button className="btn btn-primary">新規納品書発行</button>
      </div>
      
      {/* 統計情報 */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>納品書総数</h3>
          <p className="amount">{stats.deliveryNotesCount}件</p>
        </div>
        <div className="summary-card">
          <h3>今月の納品書</h3>
          <p className="amount">{deliveryNotes.filter(note => 
            new Date(note.deliveryDate).getMonth() === new Date().getMonth()
          ).length}件</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">データを読み込み中...</div>
      ) : error ? (
        <div className="error">
          エラー: {error}
          <button onClick={clearError}>エラーをクリア</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>納品書ID</th>
                <th>取引先</th>
                <th>製品名</th>
                <th>数量</th>
                <th>単価</th>
                <th>合計金額</th>
                <th>納品日</th>
                <th>状態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {deliveryNotes.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.companyName}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity.toLocaleString()}</td>
                  <td>¥{item.unitPrice.toLocaleString()}</td>
                  <td>¥{item.totalAmount.toLocaleString()}</td>
                  <td>{item.deliveryDate}</td>
                  <td>
                    <span className={`status ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline">詳細</button>
                    <button className="btn btn-sm btn-outline">メール送信</button>
                    <button className="btn btn-sm btn-outline">PDF</button>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => updateDeliveryNote(item.id, { 
                        status: item.status === '発行済み' ? '未発行' : '発行済み' 
                      })}
                    >
                      状態変更
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderInvoiceTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>請求書発行管理</h2>
        <button className="btn btn-primary">新規請求書発行</button>
      </div>
      
      {/* 統計情報 */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>請求書総数</h3>
          <p className="amount">{stats.invoicesCount}件</p>
        </div>
        <div className="summary-card">
          <h3>今月の請求書</h3>
          <p className="amount">{invoices.filter(invoice => 
            new Date(invoice.issueDate).getMonth() === new Date().getMonth()
          ).length}件</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">データを読み込み中...</div>
      ) : error ? (
        <div className="error">
          エラー: {error}
          <button onClick={clearError}>エラーをクリア</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>請求書ID</th>
                <th>取引先</th>
                <th>請求書番号</th>
                <th>金額</th>
                <th>発行日</th>
                <th>支払期限</th>
                <th>状態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.companyName}</td>
                  <td>{item.invoiceNumber}</td>
                  <td>¥{item.totalAmount.toLocaleString()}</td>
                  <td>{item.issueDate}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`status ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline">詳細</button>
                    <button className="btn btn-sm btn-outline">メール送信</button>
                    <button className="btn btn-sm btn-outline">PDF</button>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => updateInvoice(item.id, { 
                        status: item.status === '発行済み' ? '未発行' : '発行済み' 
                      })}
                    >
                      状態変更
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderReceivablesTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>売掛金管理</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>未入金合計</h3>
            <p className="amount">¥120,000</p>
          </div>
          <div className="summary-card alert">
            <h3>期限超過</h3>
            <p className="amount">¥30,000</p>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>売掛金ID</th>
              <th>取引先</th>
              <th>請求書番号</th>
              <th>金額</th>
              <th>支払期限</th>
              <th>状態</th>
              <th>期限超過日数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {receivablesData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.companyName}</td>
                <td>{item.invoiceNumber}</td>
                <td>¥{item.amount.toLocaleString()}</td>
                <td>{item.dueDate}</td>
                <td>
                  <span className={`status ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.overdueDays ? `${item.overdueDays}日` : '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline">詳細</button>
                  <button className="btn btn-sm btn-outline">督促</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>入金データ照合・消込</h2>
        <button className="btn btn-primary">CSV取込</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>入金ID</th>
              <th>入金日</th>
              <th>金額</th>
              <th>取引先名</th>
              <th>摘要</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>¥{item.amount.toLocaleString()}</td>
                <td>{item.accountName}</td>
                <td>{item.memo}</td>
                <td>
                  <span className={`status ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline">詳細</button>
                  {item.status === '未照合' && (
                    <button className="btn btn-sm btn-primary">手動照合</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="invoice-management-system">
      <div className="header">
        <h1>納品・請求管理システム</h1>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          納品書発行
        </button>
        <button 
          className={`tab ${activeTab === 'invoice' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoice')}
        >
          請求書発行
        </button>
        <button 
          className={`tab ${activeTab === 'receivables' ? 'active' : ''}`}
          onClick={() => setActiveTab('receivables')}
        >
          売掛金管理
        </button>
        <button 
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          入金データ照合
        </button>
      </div>

      <div className="content">
        {activeTab === 'delivery' && renderDeliveryTab()}
        {activeTab === 'invoice' && renderInvoiceTab()}
        {activeTab === 'receivables' && renderReceivablesTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
      </div>
    </div>
  );
};

export default InvoiceManagementSystem; 