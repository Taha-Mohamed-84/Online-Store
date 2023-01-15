CREATE TABLE IF NOT EXISTS user_t
(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(200),
    lastName VARCHAR(200),
    password VARCHAR(350),
    user_name VARCHAR(200)
);
