import * as dotenv from 'dotenv';
import { getAllBlogs, getAllCategories, getAllTags } from '../lib/microcms';

// .env.localファイルを読み込む
dotenv.config({ path: '.env.local' });

async function testMicroCMS() {
  console.log('microCMS接続テストを開始します...\n');

  // 環境変数の確認
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    console.error('❌ 環境変数が設定されていません');
    console.error('以下の環境変数を設定してください:');
    console.error('  - MICROCMS_SERVICE_DOMAIN');
    console.error('  - MICROCMS_API_KEY');
    console.error('\n.env.localファイルを作成して設定してください。');
    process.exit(1);
  }

  console.log('✅ 環境変数が設定されています');
  console.log(`   SERVICE_DOMAIN: ${serviceDomain.substring(0, 10)}...`);
  console.log(`   API_KEY: ${apiKey.substring(0, 10)}...\n`);

  try {
    // ブログ記事の取得テスト
    console.log('📝 ブログ記事の取得テスト...');
    const blogs = await getAllBlogs(5, 0);
    console.log(`   ✅ 成功: ${blogs.contents.length}件の記事を取得`);
    if (blogs.contents.length > 0) {
      console.log(`   📄 最初の記事: ${blogs.contents[0].title}`);
    }

    // カテゴリの取得テスト
    console.log('\n📂 カテゴリの取得テスト...');
    const categories = await getAllCategories();
    console.log(`   ✅ 成功: ${categories.length}件のカテゴリを取得`);
    if (categories.length > 0) {
      console.log(`   📁 最初のカテゴリ: ${categories[0].name}`);
    }

    // タグの取得テスト
    console.log('\n🏷️  タグの取得テスト...');
    const tags = await getAllTags();
    console.log(`   ✅ 成功: ${tags.length}件のタグを取得`);
    if (tags.length > 0) {
      console.log(`   🏷️  最初のタグ: ${tags[0].name}`);
    }

    console.log('\n✅ microCMSとの接続は正常です！');
  } catch (error: any) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    if (error.response) {
      console.error(`   ステータス: ${error.response.status}`);
      console.error(`   メッセージ: ${error.response.statusText}`);
    }
    process.exit(1);
  }
}

testMicroCMS();

