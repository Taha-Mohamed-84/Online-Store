import express, { Request, Response } from 'express';
import bodyparser from 'body-parser';
import dotinv from 'dotenv';
import users_routes from './handlers/users_h';
import product_routes from './handlers/products_h';
import order_routes from './handlers/orders_h';
import { Global } from './global';

dotinv.config();
const app: express.Application = express();
const address: string = 'localhost:3000';

app.use(bodyparser.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Our Online Store');
});

users_routes(app);
product_routes(app);
order_routes(app);
app.listen(Global.port, () => {
  console.log(`starting app on: ${address}`);
});

export default app;
