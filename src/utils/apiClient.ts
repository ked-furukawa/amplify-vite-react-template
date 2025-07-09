// ローカルAPIサーバー用のクライアント
const API_BASE_URL = 'http://localhost:3001';

// データ型定義
export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
  category: string;
  unit: string;
  status: 'active' | 'inactive';
}

export interface DeliveryNote {
  id: string;
  companyId: string;
  companyName: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  status: '発行済み' | '未発行';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: '発行済み' | '未発行';
  deliveryNoteIds: string[];
  createdAt: string;
}

export interface AccountsReceivable {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  amount: number;
  dueDate: string;
  status: '未入金' | '一部入金' | '入金済み' | '期限超過';
  overdueDays: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  receivableId: string | null;
  date: string;
  amount: number;
  accountName: string;
  memo: string;
  status: '未照合' | '照合済み' | '手動対応';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  materialCode: string;
  materialName: string;
  supplierId: string;
  supplierName: string;
  currentStock: number;
  orderPoint: number;
  orderQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string | null;
  expectedDeliveryDate: string | null;
  status: '発注済み' | '納品済み' | '完了' | '未発注';
  createdAt: string;
}

export interface DocumentVerification {
  id: string;
  documentType: '納品書' | '請求書';
  supplierId: string;
  supplierName: string;
  orderIds: string[];
  ocrStatus: '処理中' | '完了' | 'エラー' | '要修正';
  matchStatus: '一致' | '不一致' | '未照合';
  discrepancies: string[];
  uploadDate: string;
  verifiedDate?: string;
}

export interface PaymentSchedule {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: '予定' | '支払済み' | '期限超過';
  reminderSent: boolean;
  reminderDate?: string;
  createdAt: string;
}

export interface AccountsPayable {
  id: string;
  scheduleId: string;
  supplierName: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  status: '未照合' | '照合済み' | '手動対応';
  createdAt: string;
}

// API関数
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 会社マスター
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>('/companies');
  }

  // 商品マスター
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  // 納品書関連
  async getDeliveryNotes(): Promise<DeliveryNote[]> {
    return this.request<DeliveryNote[]>('/deliveryNotes');
  }

  async createDeliveryNote(data: Omit<DeliveryNote, 'id' | 'createdAt'>): Promise<DeliveryNote> {
    return this.request<DeliveryNote>('/deliveryNotes', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });
  }

  async updateDeliveryNote(id: string, data: Partial<DeliveryNote>): Promise<DeliveryNote> {
    return this.request<DeliveryNote>(`/deliveryNotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 請求書関連
  async getInvoices(): Promise<Invoice[]> {
    return this.request<Invoice[]>('/invoices');
  }

  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 売掛金関連
  async getAccountsReceivable(): Promise<AccountsReceivable[]> {
    return this.request<AccountsReceivable[]>('/accountsReceivable');
  }

  async updateAccountsReceivable(id: string, data: Partial<AccountsReceivable>): Promise<AccountsReceivable> {
    return this.request<AccountsReceivable>(`/accountsReceivable/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 入金記録関連
  async getPaymentRecords(): Promise<PaymentRecord[]> {
    return this.request<PaymentRecord[]>('/paymentRecords');
  }

  async createPaymentRecord(data: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<PaymentRecord> {
    return this.request<PaymentRecord>('/paymentRecords', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });
  }

  async updatePaymentRecord(id: string, data: Partial<PaymentRecord>): Promise<PaymentRecord> {
    return this.request<PaymentRecord>(`/paymentRecords/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 発注関連
  async getOrderItems(): Promise<OrderItem[]> {
    return this.request<OrderItem[]>('/orderItems');
  }

  async updateOrderItem(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    return this.request<OrderItem>(`/orderItems/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 書類照合関連
  async getDocumentVerifications(): Promise<DocumentVerification[]> {
    return this.request<DocumentVerification[]>('/documentVerifications');
  }

  async createDocumentVerification(data: Omit<DocumentVerification, 'id'>): Promise<DocumentVerification> {
    return this.request<DocumentVerification>('/documentVerifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDocumentVerification(id: string, data: Partial<DocumentVerification>): Promise<DocumentVerification> {
    return this.request<DocumentVerification>(`/documentVerifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 支払予定関連
  async getPaymentSchedules(): Promise<PaymentSchedule[]> {
    return this.request<PaymentSchedule[]>('/paymentSchedules');
  }

  async updatePaymentSchedule(id: string, data: Partial<PaymentSchedule>): Promise<PaymentSchedule> {
    return this.request<PaymentSchedule>(`/paymentSchedules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 買掛金関連
  async getAccountsPayable(): Promise<AccountsPayable[]> {
    return this.request<AccountsPayable[]>('/accountsPayable');
  }

  async updateAccountsPayable(id: string, data: Partial<AccountsPayable>): Promise<AccountsPayable> {
    return this.request<AccountsPayable>(`/accountsPayable/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 期限超過の自動更新
  async updateOverdueReceivables(): Promise<void> {
    const receivables = await this.getAccountsReceivable();
    const today = new Date().toISOString().split('T')[0];
    
    const overdueItems = receivables.filter(item => 
      item.dueDate < today && item.status !== '期限超過'
    );

    const updatePromises = overdueItems.map(item => {
      const overdueDays = Math.floor(
        (new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return this.updateAccountsReceivable(item.id, {
        status: '期限超過',
        overdueDays,
      });
    });

    await Promise.all(updatePromises);
  }

  // 自動発注の実行
  async executeAutoOrder(): Promise<number> {
    const orders = await this.getOrderItems();
    const lowStockItems = orders.filter(item => 
      item.currentStock <= item.orderPoint && item.status === '未発注'
    );

    const updatePromises = lowStockItems.map(item => 
      this.updateOrderItem(item.id, {
        status: '発注済み',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7日後
      })
    );

    await Promise.all(updatePromises);
    return lowStockItems.length;
  }
}

// APIクライアントのインスタンス
export const apiClient = new ApiClient(API_BASE_URL); 