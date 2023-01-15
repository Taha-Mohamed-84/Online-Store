CREATE TABLE products_t (
    prodid SERIAL PRIMARY KEY,
    prodname VARCHAR(200) ,
    prodprice numeric(10,2),
    prodcategory  VARCHAR(150)
);