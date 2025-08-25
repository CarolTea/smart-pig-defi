-- Smart Pig DeFi Database Initialization Script
-- This script creates the initial database structure

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    stellar_public_key VARCHAR(56),
    passkey_credential_id TEXT,
    passkey_public_key TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
    amount DECIMAL(20, 7) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'XLM',
    stellar_transaction_id VARCHAR(64),
    pix_transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for DeFi savings
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL DEFAULT 'savings',
    balance DECIMAL(20, 7) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'XLM',
    stellar_account_id VARCHAR(56),
    interest_rate DECIMAL(5, 4) DEFAULT 0.0500, -- 5% default
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(20, 7) NOT NULL,
    current_amount DECIMAL(20, 7) NOT NULL DEFAULT 0,
    target_date DATE,
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stellar_public_key ON users(stellar_public_key);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_stellar_account_id ON accounts(stellar_account_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: 'admin123' - change in production!)
INSERT INTO users (email, username, password_hash, is_verified) 
VALUES (
    'admin@smartpig.com', 
    'admin', 
    '$2b$10$8K1p/a0dDKQaRKxP0P5FOeogOjN.HKm.7QDbYMJGv5RXh5LG6wNau', -- admin123
    true
) ON CONFLICT (email) DO NOTHING;

-- Create view for user account summary
CREATE OR REPLACE VIEW user_account_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(a.id) as total_accounts,
    COALESCE(SUM(a.balance), 0) as total_balance,
    COUNT(sg.id) as total_goals,
    COUNT(CASE WHEN sg.is_achieved THEN 1 END) as achieved_goals
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id AND a.is_active = true
LEFT JOIN savings_goals sg ON u.id = sg.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email;