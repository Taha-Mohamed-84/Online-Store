import express, { Request, Response, NextFunction } from 'express';
import { order_t, order_details_t, orderstor } from '../models/orders_m';
import { productstor } from '../models/products_m';
import jwt from 'jsonwebtoken';
const order_Stat_active = 'active';
const order_Stat_complete = 'complete';
const stor = new orderstor();
const stor_product = new productstor();
let myUserID: number;
let myUserData;

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const headertoken = req.headers.authorization;
  let token: string = '';
  if (!headertoken) {
    res.status(401);
    res.json('Access denied,user token not provided');
    return;
  } else {
    token = headertoken;
  }

  try {
    myUserData = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    myUserID = myUserData['Getuser']['id'];
    jwt.verify(token, process.env.Token_PASS as unknown as string);
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

const create = async (_req: Request, res: Response) => {
  const addorder: order_t = {
    order_id: 0,
    order_status: order_Stat_active,
    user_id: myUserID
  };
  if (!_req.body.token) {
    console.log('Can stop saving here if important variable not provided');
  }
  let CheckCurrentOrder : order_t[] =[]

try {// reviews #3 Requirements
   CheckCurrentOrder = await stor.Order_status(
    myUserID,
    addorder.order_status
  );
} catch (error) {
  res.status(400);
  res.json(`Cannot Check order status ${error}`);
  return
}


  if (CheckCurrentOrder.length === 0) {
    try {
      const neworder = await stor.create(addorder);
      res.json(neworder);
    } catch (error) {
      res.status(400);
      res.json(error);
    }
    return;
  } else if (CheckCurrentOrder.length > 0) {
    res.status(406);
    res.json(CheckCurrentOrder);
    return;
  } else {
    res.status(400);
    res.json('Genral Error');
    return;
  }
};

const put_status = async (_req: Request, res: Response) => {
  const addorder: order_t = {
    order_id: parseInt(_req.params.orderid),
    order_status: order_Stat_complete,
    user_id: myUserID
  };
  if (!_req.body.token) {
    console.log('Can stop saving here if important variable not provided');
  }
  const CheckCurrentOrder = await stor.Order_status(
    myUserID,
    order_Stat_active,
    addorder.order_id
  );
  if (CheckCurrentOrder.length === 1) {
    // no current order so you can open one
    try {
      const UpdateOrder = await stor.update_Order_status(
        addorder.order_status,
        myUserID,
        addorder.order_id
      );
      res.json(UpdateOrder); //+ token)
    } catch (error) {
      res.status(400);
      res.json(error);
    }
    return;
  } else if (CheckCurrentOrder.length === 0) {
    //  current order exiest cant open new one
    res.status(406);
    res.json('Order Not Found Or It is Paid Already');
    return;
  } else {
    res.status(400);
    res.json('Genral Error');
    return;
  }
};

const add_To_Order = async (_req: Request, res: Response) => {
  if (!_req.body.ProductQTY || !_req.params.orderid || !_req.params.prodid) {
    res.json(
      'please provide a valid number For Product quantity, order id and product id'
    );
    return;
  } else if (
    !parseInt(_req.body.ProductQTY) ||
    !parseInt(_req.params.orderid) ||
    !parseInt(_req.params.prodid)
  ) {
    res.json(
      'please provide a valid number For Product quantity, order id and product id'
    );
    return;
  }
  let CheckCurrentOrder : order_t[]=[]
try {// reviews #3 Requirements
  CheckCurrentOrder = await stor.Order_status(
    myUserID,
    order_Stat_active,
    parseInt(_req.params.orderid));
} catch (error) {
  res.status(400);
  res.json(`Cannot Check order status ${error}`);
  return
}

  


  if (CheckCurrentOrder.length === 1) {
    // i get her one order for my user and its active
  } else if (CheckCurrentOrder.length === 0) {
    //  current order not exiest or its not active
    res.status(406);
    res.json('Order Not Found Or It is Paid Already');
    return;
  } else {
    res.status(400);
    res.json('Genral Error');
    return;
  }

  const CheckProduct = await stor_product.product_status(
    parseInt(_req.params.prodid)
  );

  let MyProdPrice: number = -1;

  if (CheckProduct.length === 1) {
    CheckProduct.forEach((itm) => {
      MyProdPrice = itm.prodprice;
    });
    if (MyProdPrice === -1) {
      // sure price is ok
      res.status(406);
      res.json('cannot get price');
      return;
    }
  } else if (CheckProduct.length === 0) {
    //  current order not exiest or its not active
    res.status(406);
    res.json('product Not found');
    return;
  } else {
    res.status(400);
    res.json('product Genral Error');
    return;
  }

  const addDetails: order_details_t = {
    ordet_id: 0,
    ordet_prod_qyt: _req.body.ProductQTY,
    ordet_prod_price: MyProdPrice,
    ordet_prod_total: _req.body.ProductQTY * MyProdPrice,
    ordet_order_id: parseInt(_req.params.orderid),
    ordet_product_id: parseInt(_req.params.prodid),
    ordet_user_id: myUserID
  };

  try {
    const addToOrder = await stor.addToOrder(addDetails);
    res.json(addToOrder);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const showCurr = async (_req: Request, res: Response) => {
  try {
    const user = await stor.show(myUserID, order_Stat_active);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const showDone = async (_req: Request, res: Response) => {
  try {
    const user = await stor.show(myUserID, order_Stat_complete);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const order_routes = (app: express.Application) => {
  app.get('/orders/current/', verifyAuthToken, showCurr);
  app.get('/orders/done/', verifyAuthToken, showDone);
  app.post('/orders/new/', verifyAuthToken, create);
  app.post('/orders/:orderid/Product/:prodid', verifyAuthToken, add_To_Order);
  app.put('/orders/paying/:orderid', verifyAuthToken, put_status);
};
export default order_routes;
