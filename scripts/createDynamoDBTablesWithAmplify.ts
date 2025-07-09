import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand
} from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Amplifyの設定を読み込み
async function configureAmplify() {
  try {
    // プロジェクトのamplify設定を読み込み
    const amplifyConfig = {
      Auth: {
        Cognito: {
          // 実際のCognito設定が必要な場合はここに追加
        }
      },
      API: {
        GraphQL: {
          // GraphQL設定
        }
      }
    };

    Amplify.configure(amplifyConfig);
    console.log('✅ Amplify設定を読み込みました');
  } catch (error) {
    console.log('⚠️  Amplify設定の読み込みに失敗しました。デフォルト設定を使用します。');
  }
}

// 環境変数からAWS認証情報を取得
function getAWSCredentials() {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-1'
  };

  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    throw new Error(`
AWS認証情報が設定されていません。以下の方法で設定してください：

1. 環境変数設定：
   $env:AWS_ACCESS_KEY_ID="your-access-key"
   $env:AWS_SECRET_ACCESS_KEY="your-secret-key"
   $env:AWS_DEFAULT_REGION="ap-northeast-1"

2. AWS CLI設定：
   aws configure

3. IAMロール使用（EC2等で実行する場合）

4. AWS CloudShellを使用
`);
  }

  return credentials;
}

// DynamoDBクライアントの設定
function createDynamoDBClient() {
  const credentials = getAWSCredentials();
  
  const client = new DynamoDBClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken && { sessionToken: credentials.sessionToken })
    }
  });

  return DynamoDBDocumentClient.from(client);
}

// テーブル定義
interface TableDefinition {
  tableName: string;
  partitionKey: string;
  sortKey?: string;
  globalSecondaryIndexes?: {
    indexName: string;
    partitionKey: string;
    sortKey?: string;
  }[];
}

// テーブル定義リスト
const tableDefinitions: TableDefinition[] = [
  {
    tableName: 'Companies',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'name-index',
        partitionKey: 'name'
      }
    ]
  },
  {
    tableName: 'Products',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'code-index',
        partitionKey: 'code'
      }
    ]
  },
  {
    tableName: 'DeliveryNotes',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'company-date-index',
        partitionKey: 'companyId',
        sortKey: 'deliveryDate'
      }
    ]
  },
  {
    tableName: 'Invoices',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'company-date-index',
        partitionKey: 'companyId',
        sortKey: 'issueDate'
      }
    ]
  },
  {
    tableName: 'AccountsReceivable',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'invoice-index',
        partitionKey: 'invoiceId'
      },
      {
        indexName: 'status-due-date-index',
        partitionKey: 'status',
        sortKey: 'dueDate'
      }
    ]
  },
  {
    tableName: 'PaymentRecords',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'date-index',
        partitionKey: 'date'
      },
      {
        indexName: 'status-index',
        partitionKey: 'status',
        sortKey: 'date'
      }
    ]
  },
  {
    tableName: 'OrderItems',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'supplier-index',
        partitionKey: 'supplierId',
        sortKey: 'orderDate'
      },
      {
        indexName: 'status-index',
        partitionKey: 'status',
        sortKey: 'orderDate'
      }
    ]
  },
  {
    tableName: 'DocumentVerifications',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'supplier-index',
        partitionKey: 'supplierId',
        sortKey: 'uploadDate'
      },
      {
        indexName: 'status-index',
        partitionKey: 'matchStatus',
        sortKey: 'uploadDate'
      }
    ]
  },
  {
    tableName: 'PaymentSchedules',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'due-date-index',
        partitionKey: 'dueDate'
      },
      {
        indexName: 'supplier-index',
        partitionKey: 'supplierId',
        sortKey: 'dueDate'
      }
    ]
  },
  {
    tableName: 'AccountsPayable',
    partitionKey: 'id',
    globalSecondaryIndexes: [
      {
        indexName: 'schedule-index',
        partitionKey: 'scheduleId'
      },
      {
        indexName: 'supplier-index',
        partitionKey: 'supplierName',
        sortKey: 'paymentDate'
      }
    ]
  }
];

// JSONデータとテーブル名のマッピング
const dataMapping = {
  companies: 'Companies',
  products: 'Products',
  deliveryNotes: 'DeliveryNotes',
  invoices: 'Invoices',
  accountsReceivable: 'AccountsReceivable',
  paymentRecords: 'PaymentRecords',
  orderItems: 'OrderItems',
  documentVerifications: 'DocumentVerifications',
  paymentSchedules: 'PaymentSchedules',
  accountsPayable: 'AccountsPayable'
};

// テーブルが存在するかチェック
async function tableExists(docClient: DynamoDBDocumentClient, tableName: string): Promise<boolean> {
  try {
    await docClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

// テーブル作成
async function createTable(client: DynamoDBClient, definition: TableDefinition): Promise<void> {
  const { tableName, partitionKey, sortKey, globalSecondaryIndexes } = definition;

  // AttributeDefinitions
  const attributeDefinitions = [
    {
      AttributeName: partitionKey,
      AttributeType: 'S'
    }
  ];

  if (sortKey) {
    attributeDefinitions.push({
      AttributeName: sortKey,
      AttributeType: 'S'
    });
  }

  // GSIの属性を追加
  globalSecondaryIndexes?.forEach(gsi => {
    if (!attributeDefinitions.find(attr => attr.AttributeName === gsi.partitionKey)) {
      attributeDefinitions.push({
        AttributeName: gsi.partitionKey,
        AttributeType: 'S'
      });
    }
    if (gsi.sortKey && !attributeDefinitions.find(attr => attr.AttributeName === gsi.sortKey)) {
      attributeDefinitions.push({
        AttributeName: gsi.sortKey,
        AttributeType: 'S'
      });
    }
  });

  // KeySchema
  const keySchema = [
    {
      AttributeName: partitionKey,
      KeyType: 'HASH'
    }
  ];

  if (sortKey) {
    keySchema.push({
      AttributeName: sortKey,
      KeyType: 'RANGE'
    });
  }

  // GlobalSecondaryIndexes
  const globalSecondaryIndexesConfig = globalSecondaryIndexes?.map(gsi => ({
    IndexName: gsi.indexName,
    KeySchema: [
      {
        AttributeName: gsi.partitionKey,
        KeyType: 'HASH'
      },
      ...(gsi.sortKey ? [{
        AttributeName: gsi.sortKey,
        KeyType: 'RANGE'
      }] : [])
    ],
    Projection: {
      ProjectionType: 'ALL'
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }));

  const params = {
    TableName: tableName,
    AttributeDefinitions: attributeDefinitions,
    KeySchema: keySchema,
    BillingMode: 'PAY_PER_REQUEST',
    ...(globalSecondaryIndexesConfig && globalSecondaryIndexesConfig.length > 0 && {
      GlobalSecondaryIndexes: globalSecondaryIndexesConfig
    })
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`✅ テーブル '${tableName}' を作成しました`);
    
    // テーブルがアクティブになるまで待機
    await waitForTableActive(client, tableName);
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log(`⚠️  テーブル '${tableName}' は既に存在します`);
    } else {
      throw error;
    }
  }
}

// テーブルがアクティブになるまで待機
async function waitForTableActive(client: DynamoDBClient, tableName: string): Promise<void> {
  let isActive = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!isActive && attempts < maxAttempts) {
    try {
      const result = await client.send(new DescribeTableCommand({ TableName: tableName }));
      if (result.Table?.TableStatus === 'ACTIVE') {
        isActive = true;
        console.log(`✅ テーブル '${tableName}' がアクティブになりました`);
      } else {
        console.log(`⏳ テーブル '${tableName}' のアクティブ化を待機中... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`テーブル '${tableName}' のステータス確認エラー:`, error);
    }
    attempts++;
  }

  if (!isActive) {
    throw new Error(`テーブル '${tableName}' のアクティブ化がタイムアウトしました`);
  }
}

// データをDynamoDBに投入
async function putItems(docClient: DynamoDBDocumentClient, tableName: string, items: any[]): Promise<void> {
  console.log(`📥 テーブル '${tableName}' にデータを投入中... (${items.length}件)`);

  for (const item of items) {
    try {
      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item
      }));
    } catch (error) {
      console.error(`データ投入エラー (テーブル: ${tableName}):`, error);
      console.error('エラーが発生したアイテム:', item);
      throw error;
    }
  }

  console.log(`✅ テーブル '${tableName}' にデータを投入完了 (${items.length}件)`);
}

// メイン処理
async function main(): Promise<void> {
  try {
    console.log('🚀 DynamoDBテーブル作成とデータ投入を開始します...\n');

    // Amplify設定
    await configureAmplify();

    // DynamoDBクライアントを作成
    const docClient = createDynamoDBClient();
    const client = new DynamoDBClient({
      region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
      }
    });

    // db.jsonファイルを読み込み
    const dbFilePath = path.join(__dirname, '..', 'db.json');
    if (!fs.existsSync(dbFilePath)) {
      throw new Error(`db.jsonファイルが見つかりません: ${dbFilePath}`);
    }

    const jsonData = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    console.log('📁 db.jsonファイルを読み込みました\n');

    // 各テーブルを作成
    console.log('📋 テーブル作成を開始...');
    for (const definition of tableDefinitions) {
      await createTable(client, definition);
    }
    console.log('\n✅ 全てのテーブル作成が完了しました\n');

    // データを投入
    console.log('📥 データ投入を開始...');
    for (const [jsonKey, tableName] of Object.entries(dataMapping)) {
      if (jsonData[jsonKey] && Array.isArray(jsonData[jsonKey])) {
        await putItems(docClient, tableName, jsonData[jsonKey]);
      } else {
        console.log(`⚠️  '${jsonKey}' のデータが見つからないか、配列ではありません`);
      }
    }

    console.log('\n🎉 全ての処理が完了しました！');
    console.log('\n📊 作成されたテーブル:');
    tableDefinitions.forEach(def => {
      console.log(`  - ${def.tableName}`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行時のエラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
  console.error('未処理のPromise拒否:', reason);
  process.exit(1);
});

// メイン処理実行（ESモジュール対応）
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { main, createTable, putItems, tableDefinitions }; 