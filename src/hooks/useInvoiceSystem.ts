import { useState, useEffect, useCallback } from 'react';
import { 
  apiClient, 
  DeliveryNote, 
  Invoice, 
  AccountsReceivable, 
  PaymentRecord,
  Company,
  Product
} from '../utils/apiClient';

export const useInvoiceSystem = () => {
  // 状態管理
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accountsReceivable, setAccountsReceivable] = useState<AccountsReceivable[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得関数
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        deliveryNotesData,
        invoicesData,
        accountsReceivableData,
        paymentRecordsData,
        companiesData,
        productsData
      ] = await Promise.all([
        apiClient.getDeliveryNotes(),
        apiClient.getInvoices(),
        apiClient.getAccountsReceivable(),
        apiClient.getPaymentRecords(),
        apiClient.getCompanies(),
        apiClient.getProducts()
      ]);

      setDeliveryNotes(deliveryNotesData);
      setInvoices(invoicesData);
      setAccountsReceivable(accountsReceivableData);
      setPaymentRecords(paymentRecordsData);
      setCompanies(companiesData);
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      console.error('データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初期データ取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 納品書関連の操作
  const createDeliveryNote = async (data: Omit<DeliveryNote, 'id' | 'createdAt'>) => {
    try {
      const newDeliveryNote = await apiClient.createDeliveryNote(data);
      setDeliveryNotes(prev => [newDeliveryNote, ...prev]);
      return newDeliveryNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : '納品書の作成に失敗しました');
      throw err;
    }
  };

  const updateDeliveryNote = async (id: string, data: Partial<DeliveryNote>) => {
    try {
      const updatedDeliveryNote = await apiClient.updateDeliveryNote(id, data);
      setDeliveryNotes(prev => prev.map(item => 
        item.id === id ? updatedDeliveryNote : item
      ));
      return updatedDeliveryNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : '納品書の更新に失敗しました');
      throw err;
    }
  };

  // 請求書関連の操作
  const createInvoice = async (data: Omit<Invoice, 'id' | 'createdAt'>) => {
    try {
      const newInvoice = await apiClient.createInvoice(data);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : '請求書の作成に失敗しました');
      throw err;
    }
  };

  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      const updatedInvoice = await apiClient.updateInvoice(id, data);
      setInvoices(prev => prev.map(item => 
        item.id === id ? updatedInvoice : item
      ));
      return updatedInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : '請求書の更新に失敗しました');
      throw err;
    }
  };

  // 売掛金関連の操作
  const updateAccountsReceivable = async (id: string, data: Partial<AccountsReceivable>) => {
    try {
      const updatedReceivable = await apiClient.updateAccountsReceivable(id, data);
      setAccountsReceivable(prev => prev.map(item => 
        item.id === id ? updatedReceivable : item
      ));
      return updatedReceivable;
    } catch (err) {
      setError(err instanceof Error ? err.message : '売掛金の更新に失敗しました');
      throw err;
    }
  };

  // 入金記録関連の操作
  const createPaymentRecord = async (data: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
    try {
      const newPaymentRecord = await apiClient.createPaymentRecord(data);
      setPaymentRecords(prev => [newPaymentRecord, ...prev]);
      return newPaymentRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : '入金記録の作成に失敗しました');
      throw err;
    }
  };

  const updatePaymentRecord = async (id: string, data: Partial<PaymentRecord>) => {
    try {
      const updatedPaymentRecord = await apiClient.updatePaymentRecord(id, data);
      setPaymentRecords(prev => prev.map(item => 
        item.id === id ? updatedPaymentRecord : item
      ));
      return updatedPaymentRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : '入金記録の更新に失敗しました');
      throw err;
    }
  };

  // 期限超過の自動更新
  const updateOverdueReceivables = async () => {
    try {
      await apiClient.updateOverdueReceivables();
      await fetchData(); // データを再取得
    } catch (err) {
      setError(err instanceof Error ? err.message : '期限超過更新に失敗しました');
      throw err;
    }
  };

  // 入金データの自動照合
  const matchPaymentRecord = async (paymentId: string, receivableId: string) => {
    try {
      const payment = paymentRecords.find(p => p.id === paymentId);
      const receivable = accountsReceivable.find(r => r.id === receivableId);
      
      if (!payment || !receivable) {
        throw new Error('データが見つかりません');
      }

      // 入金記録を更新
      await updatePaymentRecord(paymentId, {
        receivableId: receivableId,
        status: '照合済み'
      });

      // 売掛金の状態を更新
      const newPaidAmount = receivable.paidAmount + payment.amount;
      const newRemainingAmount = receivable.amount - newPaidAmount;
      
      let newStatus: AccountsReceivable['status'];
      if (newRemainingAmount <= 0) {
        newStatus = '入金済み';
      } else if (newPaidAmount > 0) {
        newStatus = '一部入金';
      } else {
        newStatus = receivable.status;
      }

      await updateAccountsReceivable(receivableId, {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        status: newStatus
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : '入金照合に失敗しました');
      throw err;
    }
  };

  // 統計情報の計算
  const getStats = () => {
    const totalReceivables = accountsReceivable.reduce((sum, item) => sum + item.remainingAmount, 0);
    const overdueReceivables = accountsReceivable.filter(item => item.status === '期限超過');
    const totalOverdue = overdueReceivables.reduce((sum, item) => sum + item.remainingAmount, 0);
    const unmatchedPayments = paymentRecords.filter(item => item.status === '未照合');
    const totalUnmatched = unmatchedPayments.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      totalReceivables,
      overdueCount: overdueReceivables.length,
      totalOverdue,
      unmatchedCount: unmatchedPayments.length,
      totalUnmatched,
      deliveryNotesCount: deliveryNotes.length,
      invoicesCount: invoices.length,
      unpaidReceivablesCount: accountsReceivable.filter(item => 
        item.status === '未入金' || item.status === '一部入金'
      ).length
    };
  };

  return {
    // データ
    deliveryNotes,
    invoices,
    accountsReceivable,
    paymentRecords,
    companies,
    products,
    loading,
    error,
    
    // 操作関数
    createDeliveryNote,
    updateDeliveryNote,
    createInvoice,
    updateInvoice,
    updateAccountsReceivable,
    createPaymentRecord,
    updatePaymentRecord,
    updateOverdueReceivables,
    matchPaymentRecord,
    
    // ユーティリティ
    fetchData,
    getStats,
    
    // エラー処理
    clearError: () => setError(null),
  };
}; 