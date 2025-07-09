import { useState } from 'react';
import './PurchaseManagement.css';

interface OrderItem {
  id: string;
  materialCode: string;
  materialName: string;
  supplierName: string;
  currentStock: number;
  orderPoint: number;
  orderQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  status: '発注済み' | '納品済み' | '完了';
}

interface DocumentVerification {
  id: string;
  documentType: '納品書' | '請求書';
  supplierName: string;
  orderIds: string[];
  ocrStatus: '処理中' | '完了' | 'エラー' | '要修正';
  matchStatus: '一致' | '不一致' | '未照合';
  discrepancies: string[];
  uploadDate: string;
  verifiedDate?: string;
}

interface PaymentSchedule {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: '予定' | '支払済み' | '期限超過';
  reminderSent: boolean;
}

interface AccountsPayable {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  bankTransferData?: string;
  status: '未照合' | '照合済み' | '手動対応';
  discrepancyReason?: string;
}

const PurchaseManagementSystem = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'verification' | 'payments' | 'payables'>('orders');
  const [orderMethod, setOrderMethod] = useState<'manual' | 'auto' | 'product'>('manual');

  // サンプルデータ
  const orderData: OrderItem[] = [
    {
      id: 'O001',
      materialCode: 'M001',
      materialName: '大豆（国産）',
      supplierName: '株式会社北海道農産',
      currentStock: 50,
      orderPoint: 100,
      orderQuantity: 500,
      unitPrice: 800,
      totalAmount: 400000,
      orderDate: '2024-01-15',
      expectedDeliveryDate: '2024-01-20',
      status: '納品済み'
    },
    {
      id: 'O002',
      materialCode: 'M002',
      materialName: '小麦（国産）',
      supplierName: '東北製粉株式会社',
      currentStock: 20,
      orderPoint: 50,
      orderQuantity: 200,
      unitPrice: 300,
      totalAmount: 60000,
      orderDate: '2024-01-16',
      expectedDeliveryDate: '2024-01-22',
      status: '発注済み'
    },
    {
      id: 'O003',
      materialCode: 'M003',
      materialName: '塩',
      supplierName: '瀬戸内塩業',
      currentStock: 5,
      orderPoint: 20,
      orderQuantity: 100,
      unitPrice: 150,
      totalAmount: 15000,
      orderDate: '2024-01-17',
      expectedDeliveryDate: '2024-01-25',
      status: '発注済み'
    }
  ];

  const verificationData: DocumentVerification[] = [
    {
      id: 'V001',
      documentType: '納品書',
      supplierName: '株式会社北海道農産',
      orderIds: ['O001'],
      ocrStatus: '完了',
      matchStatus: '一致',
      discrepancies: [],
      uploadDate: '2024-01-20',
      verifiedDate: '2024-01-20'
    },
    {
      id: 'V002',
      documentType: '請求書',
      supplierName: '東北製粉株式会社',
      orderIds: ['O002'],
      ocrStatus: '完了',
      matchStatus: '不一致',
      discrepancies: ['数量相違: 発注200kg, 請求220kg'],
      uploadDate: '2024-01-18',
    },
    {
      id: 'V003',
      documentType: '納品書',
      supplierName: '瀬戸内塩業',
      orderIds: ['O003'],
      ocrStatus: 'エラー',
      matchStatus: '未照合',
      discrepancies: ['OCR読み取りエラー'],
      uploadDate: '2024-01-19',
    }
  ];

  const paymentData: PaymentSchedule[] = [
    {
      id: 'P001',
      supplierName: '株式会社北海道農産',
      invoiceNumber: 'INV-H-001',
      amount: 400000,
      dueDate: '2024-02-20',
      status: '予定',
      reminderSent: false
    },
    {
      id: 'P002',
      supplierName: '東北製粉株式会社',
      invoiceNumber: 'INV-T-002',
      amount: 66000,
      dueDate: '2024-02-15',
      status: '予定',
      reminderSent: true
    },
    {
      id: 'P003',
      supplierName: '関西食材',
      invoiceNumber: 'INV-K-003',
      amount: 85000,
      dueDate: '2024-01-31',
      status: '期限超過',
      reminderSent: true
    }
  ];

  const payableData: AccountsPayable[] = [
    {
      id: 'AP001',
      supplierName: '株式会社北海道農産',
      invoiceNumber: 'INV-H-001',
      amount: 400000,
      paymentDate: '2024-01-25',
      bankTransferData: 'TXN-001-400000',
      status: '照合済み'
    },
    {
      id: 'AP002',
      supplierName: '東北製粉株式会社',
      invoiceNumber: 'INV-T-002',
      amount: 66000,
      paymentDate: '2024-01-26',
      status: '未照合'
    },
    {
      id: 'AP003',
      supplierName: '不明仕入先',
      invoiceNumber: '',
      amount: 45000,
      paymentDate: '2024-01-27',
      bankTransferData: 'TXN-003-45000',
      status: '手動対応',
      discrepancyReason: '仕入先不明'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了':
      case '照合済み':
      case '支払済み':
      case '一致':
        return 'status-success';
      case '発注済み':
      case '予定':
      case '未照合':
      case '処理中':
        return 'status-warning';
      case '期限超過':
      case 'エラー':
      case '不一致':
        return 'status-danger';
      case '納品済み':
      case '手動対応':
      case '要修正':
        return 'status-info';
      default:
        return 'status-default';
    }
  };

  const renderOrdersTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>発注リスト管理</h2>
        <div className="order-method-selector">
          <button 
            className={`method-btn ${orderMethod === 'manual' ? 'active' : ''}`}
            onClick={() => setOrderMethod('manual')}
          >
            個別選択
          </button>
          <button 
            className={`method-btn ${orderMethod === 'auto' ? 'active' : ''}`}
            onClick={() => setOrderMethod('auto')}
          >
            発注点割れ
          </button>
          <button 
            className={`method-btn ${orderMethod === 'product' ? 'active' : ''}`}
            onClick={() => setOrderMethod('product')}
          >
            製品別
          </button>
        </div>
        <button className="btn btn-primary">新規発注作成</button>
      </div>

      {orderMethod === 'manual' && (
        <div className="search-section">
          <input 
            type="text" 
            placeholder="原材料名または原材料コードを入力..." 
            className="search-input"
          />
          <button className="btn btn-outline">検索</button>
        </div>
      )}

      {orderMethod === 'auto' && (
        <div className="alert alert-info">
          <strong>発注点割れ原材料:</strong> 以下の原材料が発注点を下回っています
        </div>
      )}

      {orderMethod === 'product' && (
        <div className="search-section">
          <input 
            type="text" 
            placeholder="製品名または製品コードを入力..." 
            className="search-input"
          />
          <button className="btn btn-outline">原材料表示</button>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>発注ID</th>
              <th>原材料コード</th>
              <th>原材料名</th>
              <th>仕入先</th>
              <th>現在庫</th>
              <th>発注点</th>
              <th>発注数量</th>
              <th>単価</th>
              <th>合計金額</th>
              <th>発注日</th>
              <th>納期予定</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((item) => (
              <tr key={item.id} className={item.currentStock <= item.orderPoint ? 'highlight-row' : ''}>
                <td>{item.id}</td>
                <td>{item.materialCode}</td>
                <td>{item.materialName}</td>
                <td>{item.supplierName}</td>
                <td className={item.currentStock <= item.orderPoint ? 'low-stock' : ''}>
                  {item.currentStock}
                </td>
                <td>{item.orderPoint}</td>
                <td>{item.orderQuantity.toLocaleString()}</td>
                <td>¥{item.unitPrice.toLocaleString()}</td>
                <td>¥{item.totalAmount.toLocaleString()}</td>
                <td>{item.orderDate}</td>
                <td>{item.expectedDeliveryDate}</td>
                <td>
                  <span className={`status ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline">詳細</button>
                  <button className="btn btn-sm btn-outline">編集</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVerificationTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>納品書・請求書照合</h2>
        <div className="upload-section">
          <button className="btn btn-primary">📷 納品書撮影</button>
          <button className="btn btn-primary">📷 請求書撮影</button>
          <button className="btn btn-outline">📁 ファイルアップロード</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>処理待ち</h3>
          <p className="amount">3件</p>
        </div>
        <div className="summary-card alert">
          <h3>要確認</h3>
          <p className="amount">2件</p>
        </div>
        <div className="summary-card success">
          <h3>完了</h3>
          <p className="amount">15件</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>書類ID</th>
              <th>書類種別</th>
              <th>仕入先</th>
              <th>対象発注</th>
              <th>OCR状態</th>
              <th>照合結果</th>
              <th>相違内容</th>
              <th>アップロード日</th>
              <th>確認日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {verificationData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <span className={`doc-type ${item.documentType === '納品書' ? 'delivery' : 'invoice'}`}>
                    {item.documentType}
                  </span>
                </td>
                <td>{item.supplierName}</td>
                <td>{item.orderIds.join(', ')}</td>
                <td>
                  <span className={`status ${getStatusColor(item.ocrStatus)}`}>
                    {item.ocrStatus}
                  </span>
                </td>
                <td>
                  <span className={`status ${getStatusColor(item.matchStatus)}`}>
                    {item.matchStatus}
                  </span>
                </td>
                <td>
                  {item.discrepancies.length > 0 ? (
                    <ul className="discrepancy-list">
                      {item.discrepancies.map((disc, index) => (
                        <li key={index}>{disc}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
                <td>{item.uploadDate}</td>
                <td>{item.verifiedDate || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline">詳細</button>
                  {item.ocrStatus === 'エラー' && (
                    <button className="btn btn-sm btn-primary">再処理</button>
                  )}
                  {item.matchStatus === '不一致' && (
                    <button className="btn btn-sm btn-warning">確認依頼</button>
                  )}
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
        <h2>支払予定管理</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>今月支払予定</h3>
            <p className="amount">¥551,000</p>
          </div>
          <div className="summary-card alert">
            <h3>期限超過</h3>
            <p className="amount">¥85,000</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <select className="filter-select">
          <option value="">全て</option>
          <option value="thisWeek">今週支払い</option>
          <option value="thisMonth">今月支払い</option>
          <option value="overdue">期限超過</option>
        </select>
        <button className="btn btn-outline">支払予定作成</button>
        <button className="btn btn-primary">一括支払処理</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>支払ID</th>
              <th>仕入先</th>
              <th>請求書番号</th>
              <th>金額</th>
              <th>支払期日</th>
              <th>支払日</th>
              <th>状態</th>
              <th>リマインド</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.supplierName}</td>
                <td>{item.invoiceNumber}</td>
                <td>¥{item.amount.toLocaleString()}</td>
                <td>{item.dueDate}</td>
                <td>{item.paymentDate || '-'}</td>
                <td>
                  <span className={`status ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.reminderSent ? (
                    <span className="reminder sent">送信済み</span>
                  ) : (
                    <span className="reminder not-sent">未送信</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline">詳細</button>
                  {item.status === '予定' && (
                    <button className="btn btn-sm btn-primary">支払実行</button>
                  )}
                  {!item.reminderSent && (
                    <button className="btn btn-sm btn-outline">リマインド</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayablesTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>買掛金消込</h2>
        <button className="btn btn-primary">銀行データ取込</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>消込ID</th>
              <th>仕入先</th>
              <th>請求書番号</th>
              <th>金額</th>
              <th>支払日</th>
              <th>銀行取引データ</th>
              <th>状態</th>
              <th>相違理由</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {payableData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.supplierName}</td>
                <td>{item.invoiceNumber || '-'}</td>
                <td>¥{item.amount.toLocaleString()}</td>
                <td>{item.paymentDate}</td>
                <td>{item.bankTransferData || '-'}</td>
                <td>
                  <span className={`status ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.discrepancyReason || '-'}</td>
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
    <div className="purchase-management-system">
      <div className="header">
        <h1>仕入・支払管理システム</h1>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          発注リスト管理
        </button>
        <button 
          className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          納品書・請求書照合
        </button>
        <button 
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          支払予定管理
        </button>
        <button 
          className={`tab ${activeTab === 'payables' ? 'active' : ''}`}
          onClick={() => setActiveTab('payables')}
        >
          買掛金消込
        </button>
      </div>

      <div className="content">
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'verification' && renderVerificationTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'payables' && renderPayablesTab()}
      </div>
    </div>
  );
};

export default PurchaseManagementSystem; 