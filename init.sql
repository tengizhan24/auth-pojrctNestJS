-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Функция для UUIDv7 (если PostgreSQL < 16)
CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid AS $$
BEGIN
    -- UUID v7 implementation (time-ordered UUID)
    RETURN encode(
        set_bit(set_bit(
            overlay(
                uuid_send(gen_random_uuid())
                placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                from 1 for 6
            ),
            6, 1
        ), 7, 1),
        'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица марок автомобилей
CREATE TABLE IF NOT EXISTS brands (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица моделей автомобилей
CREATE TABLE IF NOT EXISTS car_models (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    brand_uuid UUID REFERENCES brands(uuid) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_uuid, name)
);

-- Таблица выбора пользователей
CREATE TABLE IF NOT EXISTS user_cars (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE,
    brand_uuid UUID REFERENCES brands(uuid) ON DELETE CASCADE,
    model_uuid UUID REFERENCES car_models(uuid) ON DELETE CASCADE,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_uuid, model_uuid)
);

-- Индексы для производительности
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_car_models_brand ON car_models(brand_uuid);
CREATE INDEX idx_user_cars_user ON user_cars(user_uuid);
CREATE INDEX idx_user_cars_model ON user_cars(model_uuid);

-- Тестовые данные (опционально)
INSERT INTO brands (name) VALUES 
('Toyota'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Ford')
ON CONFLICT (name) DO NOTHING;