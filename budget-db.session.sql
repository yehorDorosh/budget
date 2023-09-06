-- SELECT * FROM users;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS budget;


-- DROP TABLE IF EXISTS categories;

-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE user;
-- TRUNCATE TABLE categories;

SELECT
b.*,
c.name AS category_name,
c.category_type
FROM budget AS b
LEFT JOIN categories AS c ON b.category_id = c.id
WHERE b.user_id = 1