import * as dotenv from 'dotenv';
import { createClient } from 'microcms-js-sdk';

// .env.localファイルを読み込む
dotenv.config({ path: '.env.local' });

async function testDirectAPI() {
  console.log('microCMS API直接呼び出しテスト...\n');

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    console.error('❌ 環境変数が設定されていません');
    process.exit(1);
  }

  const client = createClient({
    serviceDomain,
    apiKey,
  });

  try {
    // ブログ記事を直接取得（ordersなし）
    console.log('📝 ブログ記事の取得（ordersなし）...');
    const blogsData1 = await client.get({
      endpoint: 'blogs',
      queries: { limit: 10 },
    });
    console.log(`   ✅ 成功: ${blogsData1.contents?.length || 0}件の記事を取得`);
    console.log(`   📊 合計: ${blogsData1.totalCount || 0}件`);

    // ブログ記事を直接取得（ordersあり）
    console.log('\n📝 ブログ記事の取得（orders: -publishedAt）...');
    try {
      const blogsData2 = await client.get({
        endpoint: 'blogs',
        queries: { 
          limit: 10,
          orders: '-publishedAt',
        },
      });
      console.log(`   ✅ 成功: ${blogsData2.contents?.length || 0}件の記事を取得`);
      console.log(`   📊 合計: ${blogsData2.totalCount || 0}件`);
    } catch (error: any) {
      console.log(`   ❌ エラー: ${error.message}`);
      if (error.response) {
        console.log(`   ステータス: ${error.response.status}`);
      }
    }

    // カテゴリを直接取得
    console.log('\n📂 カテゴリの取得...');
    const categoriesData = await client.get({
      endpoint: 'categories',
    });
    console.log(`   ✅ 成功: ${categoriesData.contents?.length || 0}件のカテゴリを取得`);

    if (blogsData1.contents && blogsData1.contents.length > 0) {
      console.log('\n📄 最初の記事の詳細:');
      const firstBlog = blogsData1.contents[0];
      console.log(`   - ID: ${firstBlog.id}`);
      console.log(`   - タイトル: ${firstBlog.title}`);
      console.log(`   - publishedAt: ${firstBlog.publishedAt || '未設定'}`);
      console.log(`   - createdAt: ${firstBlog.createdAt || '未設定'}`);
    }
  } catch (error: any) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    if (error.response) {
      console.error(`   ステータス: ${error.response.status}`);
      console.error(`   メッセージ: ${error.response.statusText}`);
    }
  }
}

testDirectAPI();

