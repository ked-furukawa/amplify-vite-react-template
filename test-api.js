// JSON Server API テストスクリプト
const API_BASE_URL = 'http://localhost:3001';

// API接続テスト
async function testApiConnection() {
  try {
    console.log('🔍 API接続テストを開始...');
    
    // 会社マスターの取得テスト
    const companiesResponse = await fetch(`${API_BASE_URL}/companies`);
    if (!companiesResponse.ok) {
      throw new Error(`HTTP error! status: ${companiesResponse.status}`);
    }
    const companies = await companiesResponse.json();
    console.log('✅ 会社マスター取得成功:', companies.length, '件');
    
    // 納品書の取得テスト
    const deliveryNotesResponse = await fetch(`${API_BASE_URL}/deliveryNotes`);
    if (!deliveryNotesResponse.ok) {
      throw new Error(`HTTP error! status: ${deliveryNotesResponse.status}`);
    }
    const deliveryNotes = await deliveryNotesResponse.json();
    console.log('✅ 納品書取得成功:', deliveryNotes.length, '件');
    
    // 発注アイテムの取得テスト
    const orderItemsResponse = await fetch(`${API_BASE_URL}/orderItems`);
    if (!orderItemsResponse.ok) {
      throw new Error(`HTTP error! status: ${orderItemsResponse.status}`);
    }
    const orderItems = await orderItemsResponse.json();
    console.log('✅ 発注アイテム取得成功:', orderItems.length, '件');
    
    // 新規データの作成テスト
    const newCompany = {
      name: 'テスト会社',
      address: 'テスト住所',
      phone: '03-0000-0000',
      email: 'test@example.com',
      status: 'active'
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCompany)
    });
    
    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }
    
    const createdCompany = await createResponse.json();
    console.log('✅ 新規会社作成成功:', createdCompany.id);
    
    // 作成したデータの削除
    const deleteResponse = await fetch(`${API_BASE_URL}/companies/${createdCompany.id}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`HTTP error! status: ${deleteResponse.status}`);
    }
    
    console.log('✅ テストデータ削除成功');
    
    console.log('🎉 全てのAPIテストが正常に完了しました！');
    
  } catch (error) {
    console.error('❌ APIテストエラー:', error.message);
    console.log('📋 トラブルシューティング:');
    console.log('1. JSON Serverが起動しているか確認: json-server --watch db.json --port 3001');
    console.log('2. db.jsonファイルが存在するか確認');
    console.log('3. ポート3001が使用可能か確認');
  }
}

// Node.js環境でのテスト実行
if (typeof window === 'undefined') {
  // Node.js環境
  const { fetch } = require('node-fetch') || globalThis.fetch;
  testApiConnection();
} else {
  // ブラウザ環境
  testApiConnection();
} 