# モックデータ仕様書

## 概要
このフォルダには、請求書管理システムと購買管理システムの2画面で使用するモックデータがCSV形式で格納されています。

## 請求書管理システム用データ

### 1. deliveryData.csv
- **用途**: 納品データ管理
- **フィールド**: 
  - id: 納品ID
  - companyName: 会社名
  - productName: 商品名
  - quantity: 数量
  - unitPrice: 単価
  - totalAmount: 合計金額
  - deliveryDate: 納品日
  - status: ステータス（発行済み/未発行）

### 2. invoiceData.csv
- **用途**: 請求書データ管理
- **フィールド**:
  - id: 請求書ID
  - companyName: 会社名
  - invoiceNumber: 請求書番号
  - totalAmount: 合計金額
  - issueDate: 発行日
  - dueDate: 支払期日
  - status: ステータス（発行済み/未発行）

### 3. accountsReceivable.csv
- **用途**: 売掛管理データ
- **フィールド**:
  - id: 売掛ID
  - companyName: 会社名
  - invoiceNumber: 請求書番号
  - amount: 金額
  - dueDate: 支払期日
  - status: ステータス（未入金/一部入金/入金済み/期限超過）
  - overdueDays: 延滞日数

### 4. paymentData.csv
- **用途**: 入金データ管理
- **フィールド**:
  - id: 入金ID
  - date: 入金日
  - amount: 入金金額
  - accountName: 口座名義
  - memo: 備考
  - status: ステータス（未照合/照合済み/手動対応）

## 購買管理システム用データ

### 1. orderItems.csv
- **用途**: 注文データ管理
- **フィールド**:
  - id: 注文ID
  - materialCode: 材料コード
  - materialName: 材料名
  - supplierName: 供給業者名
  - currentStock: 現在在庫
  - orderPoint: 発注点
  - orderQuantity: 発注数量
  - unitPrice: 単価
  - totalAmount: 合計金額
  - orderDate: 発注日
  - expectedDeliveryDate: 予定納期
  - status: ステータス（発注済み/納品済み/完了）

### 2. documentVerification.csv
- **用途**: 書類照合データ
- **フィールド**:
  - id: 書類ID
  - documentType: 書類種別（納品書/請求書）
  - supplierName: 供給業者名
  - orderIds: 注文ID
  - ocrStatus: OCRステータス（処理中/完了/エラー/要修正）
  - matchStatus: 照合ステータス（一致/不一致/未照合）
  - discrepancies: 不一致内容
  - uploadDate: アップロード日
  - verifiedDate: 照合日

### 3. paymentSchedule.csv
- **用途**: 支払予定データ
- **フィールド**:
  - id: 支払予定ID
  - supplierName: 供給業者名
  - invoiceNumber: 請求書番号
  - amount: 金額
  - dueDate: 支払期日
  - paymentDate: 支払日
  - status: ステータス（予定/支払済み/期限超過）
  - reminderSent: リマインダー送信済み

### 4. accountsPayable.csv
- **用途**: 買掛管理データ
- **フィールド**:
  - id: 買掛ID
  - supplierName: 供給業者名
  - invoiceNumber: 請求書番号
  - amount: 金額
  - paymentDate: 支払日
  - bankTransferData: 振込データ
  - status: ステータス（未照合/照合済み/手動対応）
  - discrepancyReason: 不一致理由

## 将来のS3アップロード仕様

### アーキテクチャ
```
フロント手動アップロード -> S3バケット -> Lambda トリガー -> DynamoDB
```

### 処理フロー
1. **手動アップロード**: フロントエンドからS3サンドボックスに直接CSVファイルをアップロード
2. **Lambda トリガー**: S3のPutObjectイベントでLambda関数が起動
3. **データ処理**: Lambda関数がCSVファイルを読み取り、パースしてバリデーション
4. **DynamoDB格納**: 処理済みデータをDynamoDBテーブルに一括挿入
5. **エラーハンドリング**: 不正データの場合はエラーログを記録

### 技術スタック
- **S3**: ファイルストレージ
- **Lambda**: サーバーレス処理
- **DynamoDB**: NoSQLデータベース
- **CloudWatch**: ログ監視
- **SNS**: エラー通知（オプション）

### CSVファイル要件
- **文字エンコーディング**: UTF-8
- **区切り文字**: カンマ（,）
- **ヘッダー**: 必須（1行目）
- **最大ファイルサイズ**: 10MB
- **最大レコード数**: 10,000行

### バリデーション
- データ型チェック
- 必須フィールドチェック
- 重複データチェック
- 日付形式チェック
- 数値範囲チェック 