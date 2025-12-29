import postgres from 'postgres';

// Initialize the database connection
// In serverless environments, this will be called per request, but postgres handles connection pooling
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create SQL client - works with any Postgres database (Supabase, Neon, Vercel, etc.)
export const sql = postgres(databaseUrl, {
  ssl: 'require', // Required for Supabase and most cloud Postgres providers
  max: 1, // Limit connection pool for serverless environments
});

export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create leads table
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create saved_views table
    await sql`
      CREATE TABLE IF NOT EXISTS saved_views (
        id VARCHAR(255) PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        filters JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_saved_views_user_id ON saved_views(user_id)
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
