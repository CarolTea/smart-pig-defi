-- Smart Pig DeFi Development Database Initialization Script
-- This script creates the initial database structure for development

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

-- Insert test data for development
INSERT INTO users (email, username, password_hash, stellar_public_key, is_verified) 
VALUES 
    ('admin@smartpig.com', 'admin', '$2b$10$8K1p/a0dDKQaRKxP0P5FOeogOjN.HKm.7QDbYMJGv5RXh5LG6wNau', 'GCKFBEIYTKP6RCZAKF4CQLF2ZQGMHG7YSQVQWLXC3DMHKSF7EHEFJFWT', true),
    ('user1@test.com', 'testuser1', '$2b$10$8K1p/a0dDKQaRKxP0P5FOeogOjN.HKm.7QDbYMJGv5RXh5LG6wNau', 'GDQJUTQYK2MQX2VGDR8MKDDWI53PMQYZJLYUTQYK2MQX2VGDR8MKDFW', true),
    ('user2@test.com', 'testuser2', '$2b$10$8K1p/a0dDKQaRKxP0P5FOeogOjN.HKm.7QDbYMJGv5RXh5LG6wNau', 'GBNWTLK5PGMP2X4UELYR6PWHVXVHJ7CGLJWQCZ4LK5PGMP2X4UELYR', true)
ON CONFLICT (email) DO NOTHING;

-- Insert test accounts
INSERT INTO accounts (user_id, account_type, balance, stellar_account_id)
SELECT 
    u.id,
    'savings',
    CASE 
        WHEN u.username = 'admin' THEN 10000.0
        WHEN u.username = 'testuser1' THEN 1500.50
        WHEN u.username = 'testuser2' THEN 2750.25
    END,
    u.stellar_public_key
FROM users u
WHERE u.username IN ('admin', 'testuser1', 'testuser2')
ON CONFLICT DO NOTHING;

-- Insert test savings goals
INSERT INTO savings_goals (user_id, account_id, name, target_amount, current_amount, target_date)
SELECT 
    u.id,
    a.id,
    CASE 
        WHEN u.username = 'testuser1' THEN 'Emergency Fund'
        WHEN u.username = 'testuser2' THEN 'Vacation Fund'
    END,
    CASE 
        WHEN u.username = 'testuser1' THEN 5000.00
        WHEN u.username = 'testuser2' THEN 3000.00
    END,
    CASE 
        WHEN u.username = 'testuser1' THEN 1500.50
        WHEN u.username = 'testuser2' THEN 1200.00
    END,
    CASE 
        WHEN u.username = 'testuser1' THEN '2024-12-31'
        WHEN u.username = 'testuser2' THEN '2024-06-30'
    END
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.username IN ('testuser1', 'testuser2')
ON CONFLICT DO NOTHING;

-- Insert test transactions
INSERT INTO transactions (user_id, type, amount, status, metadata, created_at)
SELECT 
    u.id,
    'deposit',
    500.00,
    'completed',
    '{"method": "pix", "pix_id": "test-' || u.username || '-001"}',
    NOW() - INTERVAL '7 days'
FROM users u
WHERE u.username IN ('testuser1', 'testuser2')
UNION ALL
SELECT 
    u.id,
    'deposit',
    250.50,
    'completed',
    '{"method": "stellar", "tx_id": "test-' || u.username || '-002"}',
    NOW() - INTERVAL '3 days'
FROM users u
WHERE u.username = 'testuser1'
UNION ALL
SELECT 
    u.id,
    'withdrawal',
    100.00,
    'pending',
    '{"method": "pix", "destination": "test-account"}',
    NOW() - INTERVAL '1 day'
FROM users u
WHERE u.username = 'testuser2'
ON CONFLICT DO NOTHING;

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