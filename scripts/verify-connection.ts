import * as dotenv from 'dotenv';
import { getAllBlogs, getAllCategories, getAllTags } from '../lib/microcms';

// .env.localファイルを読み込む
dotenv.config({ path: '.env.local' });

async function verifyConnection() {
  console.log('microCMS接続の最終確認を開始します...\n');

  try {
    // ブログ記事の取得
    console.log('📝 ブログ記事の取得...');
    const blogs = await getAllBlogs(10, 0);
    console.log(`   ✅ 成功: ${blogs.contents.length}件の記事を取得 (合計: ${blogs.totalCount}件)`);
    if (blogs.contents.length > 0) {
      console.log(`   📄 最初の記事: "${blogs.contents[0].title}"`);
      console.log(`   📅 公開日: ${blogs.contents[0].publishedAt || '未設定'}`);
      if (blogs.contents[0].category) {
        console.log(`   📂 カテゴリ: ${blogs.contents[0].category.name}`);
      }
    }

    // カテゴリの取得
    console.log('\n📂 カテゴリの取得...');
    const categories = await getAllCategories();
    console.log(`   ✅ 成功: ${categories.length}件のカテゴリを取得`);
    if (categories.length > 0) {
      console.log(`   📁 カテゴリ一覧:`);
      categories.forEach((cat, index) => {
        console.log(`      ${index + 1}. ${cat.name} (${cat.slug})`);
      });
    }

    // タグの取得
    console.log('\n🏷️  タグの取得...');
    const tags = await getAllTags();
    console.log(`   ✅ 成功: ${tags.length}件のタグを取得`);
    if (tags.length > 0) {
      console.log(`   🏷️  タグ一覧:`);
      tags.forEach((tag, index) => {
        console.log(`      ${index + 1}. ${tag.name} (${tag.slug})`);
      });
    } else {
      console.log(`   ⚠️  タグエンドポイントが存在しないか、タグが登録されていません`);
    }

    console.log('\n✅ microCMSとの接続は正常です！');
    console.log('\n📊 接続状況サマリー:');
    console.log(`   - ブログ記事: ${blogs.totalCount}件`);
    console.log(`   - カテゴリ: ${categories.length}件`);
    console.log(`   - タグ: ${tags.length}件`);
    console.log('\n🚀 開発サーバーで http://localhost:3000 にアクセスして確認してください。');
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

verifyConnection();



