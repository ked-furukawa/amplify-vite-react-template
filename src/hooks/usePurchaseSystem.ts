import { useState, useEffect, useCallback } from 'react';
import { 
  apiClient, 
  OrderItem, 
  DocumentVerification, 
  PaymentSchedule, 
  AccountsPayable,
  Company
} from '../utils/apiClient';

export const usePurchaseSystem = () => {
  // 状態管理
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [documentVerifications, setDocumentVerifications] = useState<DocumentVerification[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  const [accountsPayable, setAccountsPayable] = useState<AccountsPayable[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得関数
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        orderItemsData,
        documentVerificationsData,
        paymentSchedulesData,
        accountsPayableData,
        companiesData
      ] = await Promise.all([
        apiClient.getOrderItems(),
        apiClient.getDocumentVerifications(),
        apiClient.getPaymentSchedules(),
        apiClient.getAccountsPayable(),
        apiClient.getCompanies()
      ]);

      setOrderItems(orderItemsData);
      setDocumentVerifications(documentVerificationsData);
      setPaymentSchedules(paymentSchedulesData);
      setAccountsPayable(accountsPayableData);
      setCompanies(companiesData);
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

  // 発注アイテム関連の操作
  const updateOrderItem = async (id: string, data: Partial<OrderItem>) => {
    try {
      const updatedOrderItem = await apiClient.updateOrderItem(id, data);
      setOrderItems(prev => prev.map(item => 
        item.id === id ? updatedOrderItem : item
      ));
      return updatedOrderItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : '発注アイテムの更新に失敗しました');
      throw err;
    }
  };

  // 自動発注の実行
  const executeAutoOrder = async () => {
    try {
      const count = await apiClient.executeAutoOrder();
      await fetchData(); // データを再取得
      return count;
    } catch (err) {
      setError(err instanceof Error ? err.message : '自動発注の実行に失敗しました');
      throw err;
    }
  };

  // 書類照合関連の操作
  const createDocumentVerification = async (data: Omit<DocumentVerification, 'id'>) => {
    try {
      const newDocumentVerification = await apiClient.createDocumentVerification(data);
      setDocumentVerifications(prev => [newDocumentVerification, ...prev]);
      return newDocumentVerification;
    } catch (err) {
      setError(err instanceof Error ? err.message : '書類照合の作成に失敗しました');
      throw err;
    }
  };

  const updateDocumentVerification = async (id: string, data: Partial<DocumentVerification>) => {
    try {
      const updatedDocumentVerification = await apiClient.updateDocumentVerification(id, data);
      setDocumentVerifications(prev => prev.map(item => 
        item.id === id ? updatedDocumentVerification : item
      ));
      return updatedDocumentVerification;
    } catch (err) {
      setError(err instanceof Error ? err.message : '書類照合の更新に失敗しました');
      throw err;
    }
  };

  // 支払予定関連の操作
  const updatePaymentSchedule = async (id: string, data: Partial<PaymentSchedule>) => {
    try {
      const updatedPaymentSchedule = await apiClient.updatePaymentSchedule(id, data);
      setPaymentSchedules(prev => prev.map(item => 
        item.id === id ? updatedPaymentSchedule : item
      ));
      return updatedPaymentSchedule;
    } catch (err) {
      setError(err instanceof Error ? err.message : '支払予定の更新に失敗しました');
      throw err;
    }
  };

  // 買掛金関連の操作
  const updateAccountsPayable = async (id: string, data: Partial<AccountsPayable>) => {
    try {
      const updatedAccountsPayable = await apiClient.updateAccountsPayable(id, data);
      setAccountsPayable(prev => prev.map(item => 
        item.id === id ? updatedAccountsPayable : item
      ));
      return updatedAccountsPayable;
    } catch (err) {
      setError(err instanceof Error ? err.message : '買掛金の更新に失敗しました');
      throw err;
    }
  };

  // 発注方法によるフィルタリング
  const getOrdersByMethod = (method: 'manual' | 'auto' | 'product') => {
    switch (method) {
      case 'manual':
        return orderItems;
      case 'auto':
        return orderItems.filter(item => item.currentStock <= item.orderPoint);
      case 'product':
        return orderItems.sort((a, b) => a.materialName.localeCompare(b.materialName));
      default:
        return orderItems;
    }
  };

  // 在庫レベルによるフィルタリング
  const getLowStockItems = () => {
    return orderItems.filter(item => item.currentStock <= item.orderPoint);
  };

  // 期限が迫っている支払いの取得
  const getUpcomingPayments = (days: number = 7) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return paymentSchedules.filter(schedule => 
      schedule.dueDate <= targetDateString && schedule.status === '予定'
    );
  };

  // 期限超過の支払いの取得
  const getOverduePayments = () => {
    const today = new Date().toISOString().split('T')[0];
    return paymentSchedules.filter(schedule => 
      schedule.dueDate < today && schedule.status === '予定'
    );
  };

  // 書類照合の統計
  const getDocumentStats = () => {
    const totalDocuments = documentVerifications.length;
    const completedOcr = documentVerifications.filter(doc => doc.ocrStatus === '完了').length;
    const matchedDocuments = documentVerifications.filter(doc => doc.matchStatus === '一致').length;
    const unmatchedDocuments = documentVerifications.filter(doc => doc.matchStatus === '不一致').length;
    
    return {
      totalDocuments,
      completedOcr,
      matchedDocuments,
      unmatchedDocuments,
      ocrCompletionRate: totalDocuments > 0 ? (completedOcr / totalDocuments) * 100 : 0,
      matchRate: totalDocuments > 0 ? (matchedDocuments / totalDocuments) * 100 : 0,
    };
  };

  // 統計情報の計算
  const getStats = () => {
    const lowStockItems = getLowStockItems();
    const upcomingPayments = getUpcomingPayments();
    const overduePayments = getOverduePayments();
    const totalPaymentAmount = paymentSchedules
      .filter(schedule => schedule.status === '予定')
      .reduce((sum, schedule) => sum + schedule.amount, 0);
    const unmatchedDocuments = documentVerifications.filter(doc => doc.matchStatus === '不一致');
    const pendingOcr = documentVerifications.filter(doc => doc.ocrStatus === '処理中');
    
    return {
      lowStockCount: lowStockItems.length,
      upcomingPaymentCount: upcomingPayments.length,
      overduePaymentCount: overduePayments.length,
      totalPaymentAmount,
      unmatchedDocumentCount: unmatchedDocuments.length,
      pendingOcrCount: pendingOcr.length,
      totalOrderItems: orderItems.length,
      completedOrders: orderItems.filter(item => item.status === '完了').length,
      pendingOrders: orderItems.filter(item => item.status === '発注済み').length,
    };
  };

  // リマインダー送信のマーク
  const markReminderSent = async (scheduleId: string) => {
    try {
      await updatePaymentSchedule(scheduleId, {
        reminderSent: true,
        reminderDate: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'リマインダー送信のマークに失敗しました');
      throw err;
    }
  };

  // OCRステータスの更新
  const updateOcrStatus = async (docId: string, status: DocumentVerification['ocrStatus']) => {
    try {
      const updateData: Partial<DocumentVerification> = { ocrStatus: status };
      if (status === '完了') {
        updateData.verifiedDate = new Date().toISOString();
      }
      await updateDocumentVerification(docId, updateData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCRステータスの更新に失敗しました');
      throw err;
    }
  };

  // 書類照合ステータスの更新
  const updateMatchStatus = async (
    docId: string, 
    status: DocumentVerification['matchStatus'], 
    discrepancies: string[] = []
  ) => {
    try {
      await updateDocumentVerification(docId, {
        matchStatus: status,
        discrepancies,
        verifiedDate: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '照合ステータスの更新に失敗しました');
      throw err;
    }
  };

  // 支払い完了のマーク
  const markPaymentComplete = async (scheduleId: string) => {
    try {
      await updatePaymentSchedule(scheduleId, {
        status: '支払済み',
        paymentDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '支払い完了のマークに失敗しました');
      throw err;
    }
  };

  return {
    // データ
    orderItems,
    documentVerifications,
    paymentSchedules,
    accountsPayable,
    companies,
    loading,
    error,
    
    // 操作関数
    updateOrderItem,
    executeAutoOrder,
    createDocumentVerification,
    updateDocumentVerification,
    updatePaymentSchedule,
    updateAccountsPayable,
    
    // フィルタリング・検索
    getOrdersByMethod,
    getLowStockItems,
    getUpcomingPayments,
    getOverduePayments,
    
    // 統計情報
    getStats,
    getDocumentStats,
    
    // 便利な操作
    markReminderSent,
    updateOcrStatus,
    updateMatchStatus,
    markPaymentComplete,
    
    // ユーティリティ
    fetchData,
    
    // エラー処理
    clearError: () => setError(null),
  };
}; 