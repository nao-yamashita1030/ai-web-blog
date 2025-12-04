import * as dotenv from 'dotenv';
import { createClient } from 'microcms-js-sdk';

// .env.localファイルを読み込む
dotenv.config({ path: '.env.local' });

async function checkMicroCMSEndpoints() {
  console.log('microCMSのエンドポイント確認を開始します...\n');

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

  // よく使われるエンドポイント名のリスト
  const possibleEndpoints = [
    'blog',
    'blogs',
    'article',
    'articles',
    'post',
    'posts',
    'category',
    'categories',
    'tag',
    'tags',
  ];

  console.log('📋 エンドポイントの存在確認...\n');

  const existingEndpoints: string[] = [];
  const nonExistingEndpoints: string[] = [];

  for (const endpoint of possibleEndpoints) {
    try {
      await client.get({
        endpoint,
        queries: { limit: 1 },
      });
      existingEndpoints.push(endpoint);
      console.log(`✅ ${endpoint}: 存在します`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        nonExistingEndpoints.push(endpoint);
        console.log(`❌ ${endpoint}: 存在しません`);
      } else {
        console.log(`⚠️  ${endpoint}: エラー (${error.response?.status || 'unknown'})`);
      }
    }
  }

  console.log('\n📊 確認結果:');
  console.log(`   存在するエンドポイント: ${existingEndpoints.length}件`);
  if (existingEndpoints.length > 0) {
    console.log(`   - ${existingEndpoints.join(', ')}`);
  }

  console.log(`\n   存在しないエンドポイント: ${nonExistingEndpoints.length}件`);
  if (nonExistingEndpoints.length > 0) {
    console.log(`   - ${nonExistingEndpoints.join(', ')}`);
  }

  // 実際のデータを取得してみる
  if (existingEndpoints.length > 0) {
    console.log('\n📝 各エンドポイントのデータ取得テスト...\n');
    
    for (const endpoint of existingEndpoints) {
      try {
        const data = await client.get({
          endpoint,
          queries: { limit: 5 },
        });
        const count = data.contents?.length || 0;
        const totalCount = data.totalCount || 0;
        console.log(`   ${endpoint}: ${count}件取得 (合計: ${totalCount}件)`);
      } catch (error: any) {
        console.log(`   ${endpoint}: エラー - ${error.message}`);
      }
    }
  }

  console.log('\n💡 推奨事項:');
  if (existingEndpoints.includes('blog') || existingEndpoints.includes('blogs')) {
    console.log('   ✅ ブログエンドポイントが見つかりました');
  } else {
    console.log('   ⚠️  ブログエンドポイントが見つかりませんでした');
    console.log('      microCMSの管理画面で「blog」または「blogs」エンドポイントを作成してください');
  }

  if (existingEndpoints.includes('category') || existingEndpoints.includes('categories')) {
    console.log('   ✅ カテゴリエンドポイントが見つかりました');
  } else {
    console.log('   ⚠️  カテゴリエンドポイントが見つかりませんでした');
    console.log('      microCMSの管理画面で「category」または「categories」エンドポイントを作成してください');
  }

  if (existingEndpoints.includes('tag') || existingEndpoints.includes('tags')) {
    console.log('   ✅ タグエンドポイントが見つかりました');
  } else {
    console.log('   ⚠️  タグエンドポイントが見つかりませんでした');
    console.log('      microCMSの管理画面で「tag」または「tags」エンドポイントを作成してください');
  }
}

checkMicroCMSEndpoints().catch(console.error);

