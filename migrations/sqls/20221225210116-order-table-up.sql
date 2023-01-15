CREATE TABLE IF NOT EXISTS orders_t
(
    order_id SERIAL PRIMARY KEY,
	order_status VARCHAR(20),
    user_id bigint REFERENCES user_t(id)   
);
