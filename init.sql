-- Создайте этот файл если хотите добавить начальные данные
-- docker-compose.yml должен иметь: - ./init.sql:/docker-entrypoint-initdb.d/init.sql

-- Создание дополнительных таблиц или данных при старте БД
CREATE TABLE IF NOT EXISTS example_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Вставка тестовых данных (опционально)
INSERT INTO example_table (name) VALUES ('Пример данных');