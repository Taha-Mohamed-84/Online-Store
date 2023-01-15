#  Online Store Document
- run `yarn` to install the dependencies
- ENDPOINT port >>> `3000`. DEFAULT

##  Scripts and test
- to build project >>>> `yarn run build`.
- to test project >>>>  `yarn run test`.
- to start project >>>> `yarn run start`.

##  Online Store Database Schema.
- Database type >>> `postgresql`.
- Database Name >>> `onlinestoreDB`.
- Database USER >>> `postgres`. DEFAULT
- Database PASSWORD >>> `123456`. can be changed in .env file @param `POSTGRES_PASSWORD`
- Database port >>> `5432`. DEFAULT
- Database host >>> `localhost` OR `127.0.0.1`.

##  Test Database .
- Database Name >>> `onlinestoreDBtest`.
- it will be created during test

## Application Content
#### Database Content.
- postgres DataBase Name `onlinestoreDB`.
- Tabels are :-
##### user_t
- id SERIAL PRIMARY KEY
- firstName VARCHAR(200)
- lastName VARCHAR(200)
- password VARCHAR(350)
- user_name VARCHAR(200)

##### products_t
- prodid SERIAL PRIMARY KEY
- prodname VARCHAR(200)
- prodprice numeric(10,2)
- prodcategory VARCHAR(150)

##### orders_t
- order_id SERIAL PRIMARY KEY
- order_status VARCHAR(20)
- user_id bigint REFERENCES user_t(id)

##### order_details_t
- ordet_id SERIAL PRIMARY KEY
- ordet_Prod_Qyt numeric(10,2)
- ordet_Prod_Price numeric(10,2)
- ordet_Prod_total numeric(10,2)
- ordet_order_id bigint REFERENCES orders_t(order_id)
- ordet_product_id bigint REFERENCES products_t(prodid)
- ordet_user_id bigint REFERENCES user_t(id)

#### Application Working Flow.
##### Start Aplication.
- >>> run `npm run start`.
- App listen port is `3000`.

##### Users.
- add User(Sign up)
> Method :  `POST`    Path : 3000/users
>> **Body Parameters are**
```JSON
{
    "firstName":"Stirng - first Name",
    "lastName":"Stirng - last Name",
    "user_name":"Stirng - user name",
    "password":"Stirng - user password"
}
```
>> If Add Success then response will Be with User data.

- Sign in (Important to get `TOKEN` which is required for some operation).
> Method :  `GET`    Path : 3000/signin?
>> **Query Parameter**
1. user_name.
2. password.
>>> If Sign in Success then response will Be with Your `TOKEN`.

***Very Important When sign in i take user ID From token supplied with any operation***
<<<<<<<<<<<<<<<**So I don't ask for any user ID**>>>>>>>>>>>>>>>

- User Show (Must provide `TOKEN` in Headers request Under Key`@authorization`).
> Method :  `GET`    Path : 3000/users/:userid
>> `@Path Variables` :userid (User ID)
>>> If user Id Found then response will Be with User data.

- User Index (Must provide `TOKEN` in Headers request Under Key`@authorization`).
> Method :  `GET`    Path : 3000/users
>>response will Be with all User data.


##### Products.
- add New Product(Must provide `TOKEN` in Headers request Under Key`@authorization`)
> Method :  `POST`    Path : 3000/product/New
>> **Body Parameters are**
```JSON
{
    "name":"Stirng - Product Name",
    "price":Number - Product Price,
    "category":"Stirng - Product category"
}
```
>>> If Add Success then response will Be with Product data.

- Product Index ().
> Method :  `GET`    Path : 3000/product
>> Response will Be with All Product data.

- Product Show ().
> Method :  `GET`    Path : 3000/product/:Prodid
>> `@Path Variables` :Prodid (Product ID)
>>> If Product Id Found then Response will Be with Product data.

- Product Top 5 ().
> Method :  `GET`    Path : 3000/products/topfv
>>response will Be with Top Five Saled Producet data.

- Product BY Category ().
> Method :  `GET`    Path : 3000/products/cat/:catname
>> `@Path Variables` :catname (Category Name)
>>>Response will Be with All Producet data In this Catagory.

##### Orders.
- add New Order(Must provide `TOKEN` in Headers request Under Key`@authorization`)
> Method :  `POST`    Path : 3000/orders/new/
>> If there is active Order To that user It will return it.
>> if there is NO active order to that user then will create new one.
>>> Generally if operation Success then response will Be Active Order data.

- Add Product To Order (Must provide `TOKEN` in Headers request Under Key`@authorization`).
> Method :  `POST`    Path : 3000/orders/:orderid/Product/:prodid
>> `@Path Variables` :orderid (Order ID) **&&&** :prodid (Product ID)
>>> **Body Parameters are**
```JSON
{
    "ProductQTY":Number - Product Quantity
}
```
>>>> Response will Be with Added Product data.
 - ordet_id **(Genaral record ID)**
 - ordet_prod_qyt **(product Quantity)**
 - ordet_prod_price **(Product Price)**
 - ordet_prod_total **(Product Total Price)**
 - ordet_order_id **(Order ID)**
 - ordet_product_id **(Product ID)**
 - ordet_user_id **(User ID)

- Order Payment (Must provide `TOKEN` in Headers request Under Key`@authorization`). **(Order Complete)**

> Method :  `PUT`    Path : 3000/orders/paying/:orderid
>> `@Path Variables` :orderid (Order ID)
>>> If Order Id Found then Response will Be with Order data.

- Current Order by user (Must provide `TOKEN` in Headers request Under Key`@authorization`). **(No Need For User Id as Mentioned Above I take it from Provided Token)**

> Method :  `GET`    Path : 3000/orders/current/
>>response will Be with Current order data if it is exiest.

- Completed Orders ().
> Method :  `GET`    Path : 3000/orders/done/
>>Response will Be with All Completed Orders data for ***User signed in***.







