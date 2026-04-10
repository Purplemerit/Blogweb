/**
 * Database Migration Script
 * Adds missing columns to the articles table
 * 
 * Run this with: node scripts/add-missing-columns.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
  // Parse the DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  
  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if columns exist
    console.log('\n🔍 Checking for missing columns...');
    
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'articles' 
      AND column_name IN ('isPublicOnPublishType', 'coverImage')
    `;
    
    const existingColumns = await client.query(checkQuery);
    const columnNames = existingColumns.rows.map(row => row.column_name);
    
    console.log('Found columns:', columnNames);

    // Add isPublicOnPublishType if missing
    if (!columnNames.includes('isPublicOnPublishType')) {
      console.log('\n➕ Adding isPublicOnPublishType column...');
      await client.query(`
        ALTER TABLE articles 
        ADD COLUMN "isPublicOnPublishType" BOOLEAN NOT NULL DEFAULT false
      `);
      console.log('✅ Added isPublicOnPublishType column');
      
      // Create index
      console.log('➕ Creating index...');
      await client.query(`
        CREATE INDEX IF NOT EXISTS "articles_status_isPublicOnPublishType_idx" 
        ON articles(status, "isPublicOnPublishType")
      `);
      console.log('✅ Created index');
    } else {
      console.log('✅ isPublicOnPublishType column already exists');
    }

    // Add coverImage if missing
    if (!columnNames.includes('coverImage')) {
      console.log('\n➕ Adding coverImage column...');
      await client.query(`
        ALTER TABLE articles 
        ADD COLUMN "coverImage" TEXT
      `);
      console.log('✅ Added coverImage column');
    } else {
      console.log('✅ coverImage column already exists');
    }

    // Verify columns were added
    console.log('\n🔍 Verifying columns...');
    const verifyQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'articles' 
      AND column_name IN ('isPublicOnPublishType', 'coverImage')
      ORDER BY column_name
    `;
    
    const result = await client.query(verifyQuery);
    console.log('\n📊 Column details:');
    console.table(result.rows);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your dev server (Ctrl+C and run: npm run dev)');
    console.log('2. Try creating or saving an article again');
    console.log('3. Articles can now be published to PublishType platform');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Try running the SQL manually in Supabase:');
    console.error('1. Go to your Supabase dashboard');
    console.error('2. Open SQL Editor');
    console.error('3. Run the SQL from: prisma/migrations/add_public_fields.sql');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
