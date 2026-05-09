
CREATE TABLE t_p6666792_eng_tutor_website_de.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p6666792_eng_tutor_website_de.products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p6666792_eng_tutor_website_de.tg_users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p6666792_eng_tutor_website_de.cart_items (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    product_id INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE t_p6666792_eng_tutor_website_de.orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
    payment_confirmed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p6666792_eng_tutor_website_de.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    product_name VARCHAR(500) NOT NULL,
    product_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

CREATE TABLE t_p6666792_eng_tutor_website_de.reviews (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    order_id INTEGER UNIQUE,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    show_name BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p6666792_eng_tutor_website_de.user_states (
    user_id BIGINT PRIMARY KEY,
    state VARCHAR(100),
    data JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);
