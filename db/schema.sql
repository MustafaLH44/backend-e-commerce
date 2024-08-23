-- Initial database
CREATE DATABASE ecommerce_db;

-- Switch to the newly created database
\c ecommerce_db;

--Category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Product table
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    category_id INTEGER REFERENCES category(id)
);

-- table
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255)
);

-- ProductTag table (junction table)
CREATE TABLE product_tag (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES product(id),
    tag_id INTEGER REFERENCES tag(id)
);

-- some initial data (seeding)
-- Categories
INSERT INTO category (category_name) VALUES ('Electronics');
INSERT INTO category (category_name) VALUES ('Clothing');
INSERT INTO category (category_name) VALUES ('Books');

-- Tags
INSERT INTO tag (tag_name) VALUES ('New Arrival');
INSERT INTO tag (tag_name) VALUES ('Sale');
INSERT INTO tag (tag_name) VALUES ('Popular');
