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

// ローカルDynamoDB設定
const LOCAL_DYNAMODB_CONFIG = {
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  }
};

// DynamoDBクライアントの設定（ローカル環境用）
const client = new DynamoDBClient(LOCAL_DYNAMODB_CONFIG);
const docClient = DynamoDBDocumentClient.from(client);

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
async function tableExists(tableName: string): Promise<boolean> {
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
async function createTable(definition: TableDefinition): Promise<void> {
  const { tableName, partitionKey, sortKey, globalSecondaryIndexes } = definition;

  // 既存のテーブルをチェック
  const exists = await tableExists(tableName);
  if (exists) {
    console.log(`⚠️  テーブル '${tableName}' は既に存在します`);
    return;
  }

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

  // GlobalSecondaryIndexes（ローカル環境用に簡略化）
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
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }));

  const params = {
    TableName: tableName,
    AttributeDefinitions: attributeDefinitions,
    KeySchema: keySchema,
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    ...(globalSecondaryIndexesConfig && globalSecondaryIndexesConfig.length > 0 && {
      GlobalSecondaryIndexes: globalSecondaryIndexesConfig
    })
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`✅ テーブル '${tableName}' を作成しました`);
    
    // ローカル環境では待機時間を短縮
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error: any) {
    console.error(`テーブル作成エラー (${tableName}):`, error);
    throw error;
  }
}

// データをDynamoDBに投入
async function putItems(tableName: string, items: any[]): Promise<void> {
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
      // ローカル環境では続行
      continue;
    }
  }

  console.log(`✅ テーブル '${tableName}' にデータを投入完了 (${items.length}件)`);
}

// DynamoDB Localの接続確認
async function checkLocalDynamoDB(): Promise<boolean> {
  try {
    // 適当なテーブルをリストして接続確認
    await client.send(new DescribeTableCommand({ TableName: 'non-existent-table' }));
    return true;
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      // テーブルが見つからないエラーは接続成功を意味する
      return true;
    }
    return false;
  }
}

// メイン処理
async function main(): Promise<void> {
  try {
    console.log('🚀 ローカルDynamoDBテーブル作成とデータ投入を開始します...\n');

    // ローカルDynamoDBの接続確認
    console.log('🔍 ローカルDynamoDBへの接続を確認中...');
    const isConnected = await checkLocalDynamoDB();
    if (!isConnected) {
      console.error(`
❌ ローカルDynamoDBに接続できません。

以下の方法でDynamoDB Localを起動してください：

1. DynamoDB Localのダウンロード：
   https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/DynamoDBLocal.html

2. 起動コマンド：
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

3. Dockerを使用する場合：
   docker run -p 8000:8000 amazon/dynamodb-local

または、npm scriptを使用：
   npm run start-local-dynamodb
`);
      process.exit(1);
    }
    console.log('✅ ローカルDynamoDBに接続しました\n');

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
      await createTable(definition);
    }
    console.log('\n✅ 全てのテーブル作成が完了しました\n');

    // データを投入
    console.log('📥 データ投入を開始...');
    for (const [jsonKey, tableName] of Object.entries(dataMapping)) {
      if (jsonData[jsonKey] && Array.isArray(jsonData[jsonKey])) {
        await putItems(tableName, jsonData[jsonKey]);
      } else {
        console.log(`⚠️  '${jsonKey}' のデータが見つからないか、配列ではありません`);
      }
    }

    console.log('\n🎉 全ての処理が完了しました！');
    console.log('\n📊 作成されたテーブル:');
    tableDefinitions.forEach(def => {
      console.log(`  - ${def.tableName}`);
    });

    console.log('\n🌐 ローカルDynamoDBの管理画面:');
    console.log('   http://localhost:8000/shell/');

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