# DynamoDBテーブル作成スクリプト

このスクリプトは、`db.json`ファイルのデータを読み取り、DynamoDBテーブルを作成してデータを投入します。

## 必要な準備

### 1. AWS認証情報の設定

以下のいずれかの方法でAWS認証情報を設定してください：

#### 方法1: 環境変数
```bash
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
$env:AWS_DEFAULT_REGION="ap-northeast-1"
```

#### 方法2: AWSプロファイル
```bash
aws configure
```

#### 方法3: IAMロール（EC2/Lambda等で実行する場合）
- インスタンスロールまたは実行ロールを設定

### 2. 権限の確認

以下のDynamoDB権限が必要です：
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:PutItem`
- `dynamodb:Query`
- `dynamodb:Scan`

## 実行方法

### 方法1: npmスクリプト使用
```bash
npm run create-dynamodb
```

### 方法2: tsx直接実行
```bash
npx tsx scripts/createDynamoDBTables.ts
```

### 方法3: PowerShell実行ポリシー変更後
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm run create-dynamodb
```

## 作成されるテーブル

1. **Companies** - 会社情報
   - パーティションキー: `id`
   - GSI: `name-index`

2. **Products** - 製品情報
   - パーティションキー: `id`
   - GSI: `code-index`

3. **DeliveryNotes** - 納品書
   - パーティションキー: `id`
   - GSI: `company-date-index`

4. **Invoices** - 請求書
   - パーティションキー: `id`
   - GSI: `company-date-index`

5. **AccountsReceivable** - 売掛金
   - パーティションキー: `id`
   - GSI: `invoice-index`, `status-due-date-index`

6. **PaymentRecords** - 入金記録
   - パーティションキー: `id`
   - GSI: `date-index`, `status-index`

7. **OrderItems** - 発注項目
   - パーティションキー: `id`
   - GSI: `supplier-index`, `status-index`

8. **DocumentVerifications** - 書類照合
   - パーティションキー: `id`
   - GSI: `supplier-index`, `status-index`

9. **PaymentSchedules** - 支払予定
   - パーティションキー: `id`
   - GSI: `due-date-index`, `supplier-index`

10. **AccountsPayable** - 買掛金
    - パーティションキー: `id`
    - GSI: `schedule-index`, `supplier-index`

## トラブルシューティング

### 認証エラー
- AWS認証情報が正しく設定されているか確認
- 権限が適切に設定されているか確認

### テーブル作成エラー
- 同名のテーブルが既に存在する場合は警告が表示されます
- リージョンが正しく設定されているか確認

### データ投入エラー
- `db.json`ファイルが存在するか確認
- JSON形式が正しいか確認

## 実行結果例

```
🚀 DynamoDBテーブル作成とデータ投入を開始します...

📁 db.jsonファイルを読み込みました

📋 テーブル作成を開始...
✅ テーブル 'Companies' を作成しました
✅ テーブル 'Companies' がアクティブになりました
✅ テーブル 'Products' を作成しました
✅ テーブル 'Products' がアクティブになりました
...

✅ 全てのテーブル作成が完了しました

📥 データ投入を開始...
📥 テーブル 'Companies' にデータを投入中... (5件)
✅ テーブル 'Companies' にデータを投入完了 (5件)
...

🎉 全ての処理が完了しました！

📊 作成されたテーブル:
  - Companies
  - Products
  - DeliveryNotes
  - Invoices
  - AccountsReceivable
  - PaymentRecords
  - OrderItems
  - DocumentVerifications
  - PaymentSchedules
  - AccountsPayable
```

## 注意事項

- PAY_PER_REQUESTモードを使用するため、課金に注意してください
- テーブル作成は一度だけ実行してください
- 既存のテーブルがある場合は警告が表示されますが、処理は続行されます 