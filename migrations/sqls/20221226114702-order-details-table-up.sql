
CREATE TABLE IF NOT EXISTS order_details_t (
    ordet_id SERIAL PRIMARY KEY,
    ordet_Prod_Qyt numeric(10,2),
    ordet_Prod_Price numeric(10,2),
    ordet_Prod_total numeric(10,2),
    ordet_order_id bigint REFERENCES orders_t(order_id),
    ordet_product_id bigint REFERENCES products_t(prodid),
    ordet_user_id bigint REFERENCES user_t(id)
);

