# データベース設定ガイド

db.jsonファイルからDynamoDBテーブルを作成するための複数の解決方法を提供します。

## 🔒 認証問題の解決方法

### 方法1: 新しいIAMユーザーを作成
AWSコンソールでアクセスキーが作成できない場合：
1. 新しいIAMユーザーを作成
2. 管理者権限を付与
3. アクセスキーを作成

### 方法2: AWS CloudShellを使用
```bash
# AWS CloudShellでリポジトリをクローン
git clone https://github.com/your-username/amplify-vite-react-template.git
cd amplify-vite-react-template

# 依存関係をインストール
npm install

# スクリプトを実行
npm run create-dynamodb
```

### 方法3: ローカル開発環境（推奨）
認証問題を完全に回避できます。

## 🚀 実行方法

### オプション1: AWS DynamoDB（本番環境）

#### 事前準備
```powershell
# 環境変数を設定
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
$env:AWS_DEFAULT_REGION="ap-northeast-1"
```

#### 実行
```bash
npm run create-dynamodb
```

### オプション2: ローカルDynamoDB（開発環境）

#### 事前準備
```bash
# Dockerでローカル DynamoDB を起動
docker run -p 8000:8000 amazon/dynamodb-local

# または、Java版を使用
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

#### 実行
```bash
npm run create-local-dynamodb
```

## 📋 作成されるテーブル

| テーブル名 | 用途 | パーティションキー | GSI |
|-----------|------|------------------|-----|
| Companies | 会社情報 | id | name-index |
| Products | 製品情報 | id | code-index |
| DeliveryNotes | 納品書 | id | company-date-index |
| Invoices | 請求書 | id | company-date-index |
| AccountsReceivable | 売掛金 | id | invoice-index, status-due-date-index |
| PaymentRecords | 入金記録 | id | date-index, status-index |
| OrderItems | 発注項目 | id | supplier-index, status-index |
| DocumentVerifications | 書類照合 | id | supplier-index, status-index |
| PaymentSchedules | 支払予定 | id | due-date-index, supplier-index |
| AccountsPayable | 買掛金 | id | schedule-index, supplier-index |

## 🔧 トラブルシューティング

### 認証エラー: `UnrecognizedClientException`
```
The security token included in the request is invalid.
```

**解決方法:**
1. AWS認証情報を再確認
2. セッショントークンの有効期限を確認
3. ローカルDynamoDBを使用

### 接続エラー: `ECONNREFUSED`
```
connect ECONNREFUSED 127.0.0.1:8000
```

**解決方法:**
1. ローカルDynamoDBが起動していることを確認
2. ポート8000が利用可能であることを確認

### テーブル作成エラー: `ResourceInUseException`
```
Table already exists
```

**解決方法:**
- これは正常な動作です。既存のテーブルは警告が表示されますが、処理は続行されます。

## 📊 データ確認方法

### AWS DynamoDB
- [AWS DynamoDB コンソール](https://console.aws.amazon.com/dynamodb/)

### ローカルDynamoDB
- [DynamoDB Local Shell](http://localhost:8000/shell/)

## 📁 ファイル構成

```
scripts/
├── createDynamoDBTables.ts           # AWS DynamoDB用
├── createDynamoDBTablesWithAmplify.ts # Amplify認証付きAWS DynamoDB用
├── createLocalDynamoDBTables.ts      # ローカルDynamoDB用
├── README.md                         # 基本的な使用方法
└── DATABASE_SETUP_GUIDE.md          # この包括的ガイド
```

## 🎯 推奨ワークフロー

1. **開発段階**: ローカルDynamoDBを使用
   ```bash
   npm run create-local-dynamodb
   ```

2. **テスト段階**: AWS DynamoDBを使用
   ```bash
   npm run create-dynamodb
   ```

3. **本番段階**: AWS DynamoDBを使用（本番環境での実行）

## 💡 その他のオプション

### AWS CLI設定
```bash
aws configure
```

### 一時的な認証情報の使用
```bash
aws sts get-session-token
```

### IAMロールの使用（EC2等）
- インスタンスプロファイルを設定
- DynamoDB権限を付与

## 🔄 データの更新

テーブルを再作成する場合：
1. 既存のテーブルを削除（AWSコンソールまたはCLI）
2. スクリプトを再実行

## 📞 サポート

問題が発生した場合は、以下を確認してください：
1. AWS認証情報の設定
2. DynamoDB権限の確認
3. ネットワーク接続の確認
4. db.jsonファイルの存在確認

認証問題で困っている場合は、**ローカルDynamoDB**の使用を強く推奨します。 