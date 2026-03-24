CREATE TABLE classes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE schedules (
    id UUID PRIMARY KEY,
    class_id UUID REFERENCES classes(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id UUID,
    schedule_id UUID REFERENCES schedules(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plans (
    id UUID PRIMARY KEY,
    name TEXT,
    weekly_limit INT,
    stripe_price_id TEXT
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID,
    plan_id UUID REFERENCES plans(id),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    stripe_subscription_id TEXT
);
