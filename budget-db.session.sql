-- SELECT * FROM users;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS weather;


-- DROP TABLE IF EXISTS categories;

-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE budget;
-- TRUNCATE TABLE weather;

-- SELECT
-- b.*,
-- c.name AS category_name,
-- c.category_type
-- FROM budget AS b
-- LEFT JOIN categories AS c ON b.category_id = c.id
-- WHERE b.user_id = 1

-- SELECT MAX(reg_date) FROM weather WHERE id = '1'

-- SELECT * FROM weather
-- WHERE id='1' AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id='1')
-- OR id='2nd-floor' AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id='2nd-floor')
-- OR id='out-of-door' AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id='out-of-door')