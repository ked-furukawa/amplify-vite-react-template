import { useState } from 'react';

// Purchase Management System styles
const purchaseStyles = `
  .purchase-management-system {
    max-width: 1400px;
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
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
    min-width: 140px;
  }

  .tab:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }

  .tab.active {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
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
    flex-wrap: wrap;
    gap: 15px;
  }

  .tab-header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .order-method-selector {
    display: flex;
    gap: 10px;
    background: #f8f9fa;
    padding: 5px;
    border-radius: 8px;
  }

  .method-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .method-btn:hover {
    background: #e9ecef;
  }

  .method-btn.active {
    background: #28a745;
    color: white;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
  }

  .search-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
  }

  .search-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }

  .upload-section {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filters {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 10px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 0.9rem;
    background: white;
    cursor: pointer;
  }

  .filter-select:focus {
    outline: none;
    border-color: #28a745;
  }

  .summary-cards {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .summary-card {
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    min-width: 150px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(23, 162, 184, 0.3);
  }

  .summary-card.alert {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    box-shadow: 0 4px 6px rgba(220, 53, 69, 0.3);
  }

  .summary-card.success {
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    box-shadow: 0 4px 6px rgba(40, 167, 69, 0.3);
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
    font-size: 0.9rem;
  }

  .data-table th {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

  .highlight-row {
    background: #fff3cd !important;
  }

  .highlight-row:hover {
    background: #ffeaa7 !important;
  }

  .low-stock {
    color: #dc3545;
    font-weight: bold;
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

  .doc-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .doc-type.delivery {
    background: #d1ecf1;
    color: #0c5460;
  }

  .doc-type.invoice {
    background: #f8d7da;
    color: #721c24;
  }

  .discrepancy-list {
    margin: 0;
    padding-left: 15px;
    font-size: 0.8rem;
    color: #dc3545;
  }

  .discrepancy-list li {
    margin: 2px 0;
  }

  .reminder {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .reminder.sent {
    background: #d4edda;
    color: #155724;
  }

  .reminder.not-sent {
    background: #f8d7da;
    color: #721c24;
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
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
  }

  .btn-primary:hover {
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #28a745;
    color: #28a745;
  }

  .btn-outline:hover {
    background: #28a745;
    color: white;
  }

  .btn-warning {
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
    color: #212529;
  }

  .btn-warning:hover {
    box-shadow: 0 4px 8px rgba(255, 193, 7, 0.4);
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    margin-right: 5px;
  }

  .btn-sm:last-child {
    margin-right: 0;
  }

  .alert {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .alert-info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  /* レスポンシブデザイン */
  @media (max-width: 768px) {
    .purchase-management-system {
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
    
    .order-method-selector {
      width: 100%;
      justify-content: center;
    }
    
    .search-section {
      flex-direction: column;
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

    .upload-section {
      flex-direction: column;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
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
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.3);
  }

  /* 印刷時のスタイル */
  @media print {
    .purchase-management-system {
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
    box-shadow: 0 4px 6px rgba(40, 167, 69, 0.3);
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
    font-size: 0.9rem;
  }

  .data-table th {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

  .highlight-row {
    background: #fff3cd !important;
  }

  .highlight-row:hover {
    background: #ffeaa7 !important;
  }

  .low-stock {
    color: #dc3545;
    font-weight: bold;
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

  .doc-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .doc-type.delivery {
    background: #d1ecf1;
    color: #0c5460;
  }

  .doc-type.invoice {
    background: #f8d7da;
    color: #721c24;
  }

  .discrepancy-list {
    margin: 0;
    padding-left: 15px;
    font-size: 0.8rem;
    color: #dc3545;
  }

  .discrepancy-list li {
    margin: 2px 0;
  }

  .reminder {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .reminder.sent {
    background: #d4edda;
    color: #155724;
  }

  .reminder.not-sent {
    background: #f8d7da;
    color: #721c24;
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
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.3);
  }

  .btn-primary {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
  }

  .btn-primary:hover {
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #28a745;
    color: #28a745;
  }

  .btn-outline:hover {
    background: #28a745;
    color: white;
  }

  .btn-warning {
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
    color: #212529;
  }

  .btn-warning:hover {
    box-shadow: 0 4px 8px rgba(255, 193, 7, 0.4);
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    margin-right: 5px;
  }

  .btn-sm:last-child {
    margin-right: 0;
  }

  .alert {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .alert-info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
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
    .purchase-management-system {
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
    
    .order-method-selector {
      width: 100%;
      justify-content: center;
    }
    
    .search-section {
      flex-direction: column;
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

    .upload-section {
      flex-direction: column;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
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
    .purchase-management-system {
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
styleElement.textContent = purchaseStyles;
document.head.appendChild(styleElement);

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