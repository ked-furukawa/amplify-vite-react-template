import React, { useState } from 'react';
import './InvoiceManagement.css';

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

  // サンプルデータ
  const deliveryData: DeliveryData[] = [
    {
      id: 'D001',
      companyName: '株式会社A商会',
      productName: '製品A',
      quantity: 100,
      unitPrice: 500,
      totalAmount: 50000,
      deliveryDate: '2024-01-15',
      status: '発行済み'
    },
    {
      id: 'D002',
      companyName: '株式会社B商事',
      productName: '製品B',
      quantity: 50,
      unitPrice: 800,
      totalAmount: 40000,
      deliveryDate: '2024-01-16',
      status: '未発行'
    },
    {
      id: 'D003',
      companyName: '株式会社C販売',
      productName: '製品C',
      quantity: 75,
      unitPrice: 600,
      totalAmount: 45000,
      deliveryDate: '2024-01-17',
      status: '発行済み'
    }
  ];

  const invoiceData: InvoiceData[] = [
    {
      id: 'I001',
      companyName: '株式会社A商会',
      invoiceNumber: 'INV-2024-001',
      totalAmount: 50000,
      issueDate: '2024-01-31',
      dueDate: '2024-02-29',
      status: '発行済み'
    },
    {
      id: 'I002',
      companyName: '株式会社B商事',
      invoiceNumber: 'INV-2024-002',
      totalAmount: 40000,
      issueDate: '2024-01-31',
      dueDate: '2024-02-29',
      status: '発行済み'
    },
    {
      id: 'I003',
      companyName: '株式会社C販売',
      invoiceNumber: 'INV-2024-003',
      totalAmount: 45000,
      issueDate: '2024-01-31',
      dueDate: '2024-02-29',
      status: '未発行'
    }
  ];

  const receivablesData: AccountsReceivable[] = [
    {
      id: 'R001',
      companyName: '株式会社A商会',
      invoiceNumber: 'INV-2024-001',
      amount: 50000,
      dueDate: '2024-02-29',
      status: '未入金'
    },
    {
      id: 'R002',
      companyName: '株式会社B商事',
      invoiceNumber: 'INV-2024-002',
      amount: 40000,
      dueDate: '2024-02-29',
      status: '一部入金'
    },
    {
      id: 'R003',
      companyName: '株式会社D商会',
      invoiceNumber: 'INV-2024-004',
      amount: 30000,
      dueDate: '2024-01-31',
      status: '期限超過',
      overdueDays: 15
    }
  ];

  const paymentData: PaymentData[] = [
    {
      id: 'P001',
      date: '2024-01-15',
      amount: 50000,
      accountName: '株式会社A商会',
      memo: 'INV-2024-001',
      status: '照合済み'
    },
    {
      id: 'P002',
      date: '2024-01-16',
      amount: 20000,
      accountName: '株式会社B商事',
      memo: 'INV-2024-002',
      status: '照合済み'
    },
    {
      id: 'P003',
      date: '2024-01-17',
      amount: 35000,
      accountName: '不明取引先',
      memo: '',
      status: '未照合'
    }
  ];

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
            {deliveryData.map((item) => (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoiceTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>請求書発行管理</h2>
        <button className="btn btn-primary">新規請求書発行</button>
      </div>
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
            {invoiceData.map((item) => (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
