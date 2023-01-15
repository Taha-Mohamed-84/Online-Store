# Data Shapes

## user_t
- id SERIAL PRIMARY KEY
- firstName VARCHAR(200)
- lastName VARCHAR(200)
- password VARCHAR(350)
- user_name VARCHAR(200)


## products_t
- prodid SERIAL PRIMARY KEY
- prodname VARCHAR(200)
- prodprice numeric(10,2)
- prodcategory VARCHAR(150)

## orders_t
- order_id SERIAL PRIMARY KEY
- order_status VARCHAR(20)
- user_id bigint REFERENCES user_t(id)

## order_details_t
- ordet_id SERIAL PRIMARY KEY
- ordet_Prod_Qyt numeric(10,2)
- ordet_Prod_Price numeric(10,2)
- ordet_Prod_total numeric(10,2)
- ordet_order_id bigint REFERENCES orders_t(order_id)
- ordet_product_id bigint REFERENCES products_t(prodid)
- ordet_user_id bigint REFERENCES user_t(id)

