# Pet Defense - Supabase Database Schema

This document describes the database schema needed for the Pet Defense game authentication and data persistence features.

## Required Tables

### 1. users table

This table stores user account information.

```sql
CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  coins INTEGER DEFAULT 150,
  gems INTEGER DEFAULT 100,
  lives INTEGER DEFAULT 20,
  current_wave INTEGER DEFAULT 1,
  max_wave INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);
```

### 2. pets table

This table stores pets owned by users.

```sql
CREATE TABLE pets (
  pet_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  weight_kg INTEGER DEFAULT 10,
  variant VARCHAR(20),
  enchant_level INTEGER DEFAULT 0,
  power_bonus DECIMAL(10, 2) DEFAULT 1.0,
  equipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_pets_user_id ON pets(user_id);
```

## Row Level Security (RLS)

For security, enable Row Level Security on both tables:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (true);  -- Allow all users to query (username uniqueness check)

-- Allow users to insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT
  WITH CHECK (true);  -- Allow registration

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (true)  -- In a real app, you'd check auth.uid() = user_id
  WITH CHECK (true);

-- Allow users to view their own pets
CREATE POLICY "Users can view own pets" ON pets
  FOR SELECT
  USING (true);  -- In a real app, you'd check auth.uid() matches user_id

-- Allow users to insert their own pets
CREATE POLICY "Users can insert own pets" ON pets
  FOR INSERT
  WITH CHECK (true);  -- In a real app, you'd check auth.uid() matches user_id

-- Allow users to delete their own pets
CREATE POLICY "Users can delete own pets" ON pets
  FOR DELETE
  USING (true);  -- In a real app, you'd check auth.uid() matches user_id
```

## Important Notes

### Security Considerations

1. **Password Hashing**: The application now uses SHA-256 hashing for passwords. This is better than plain text but for production use, consider:
   - Using Supabase Auth instead of custom authentication
   - Using bcrypt or Argon2 for password hashing server-side
   - Adding salt to password hashes

2. **Row Level Security**: The current RLS policies are permissive to allow the game to work. For a production app:
   - Use Supabase Auth (recommended)
   - Implement proper user authentication with JWT tokens
   - Restrict policies to `auth.uid()` checks

3. **API Keys**: Never commit your Supabase API keys to version control
   - Use environment variables for production
   - The anon key in the code is only for development

### Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands above to create the tables
4. Update the `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `script.js` with your project credentials
5. Test the authentication system

### Migration from Local Storage

If users have existing data in localStorage, it will remain available when playing as a guest. When they register an account, they can save their progress to the database.

## Testing the Schema

After creating the tables, you can test them with these queries:

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify the users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Verify the pets table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pets';
```
