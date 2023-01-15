import express, { Request, Response, NextFunction } from 'express';
import { product_t, productstor } from '../models/products_m';
import jwt from 'jsonwebtoken';

const stor = new productstor();

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
    //const token = req.body.token;
    jwt.verify(token, process.env.Token_PASS as unknown as string);
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

const index = async (_req: Request, res: Response) => {
  try {  // reviews #4 Requirements
    const ProductList = await stor.index();
    res.json(ProductList);
  } catch (error) {
    res.status(401);
    res.json(`Cannot provide product list ${error}`);
  }
};

const create = async (_req: Request, res: Response) => {
  const addprod: product_t = {
    prodid: _req.body.id,
    prodname: _req.body.name,
    prodprice: _req.body.price,
    prodcategory: _req.body.category
  };

  if (!addprod.prodprice) {
    console.log('Can stop saving here if important variable not provided');
  }
  try {
    const newprod = await stor.create(addprod);
    res.json(newprod);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const show = async (_req: Request, res: Response) => {
  try {
    const ProductList = await stor.show(_req.params.Prodid);
    res.json(ProductList);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const topfive = async (_req: Request, res: Response) => {
  try {
    const ProductList = await stor.showTop5();
    res.json(ProductList);
  } catch (error) {
    res.status(100);
    res.json(error);
  }
};

const showbycatg = async (_req: Request, res: Response) => {
  try {
    const ProductList = await stor.showbycatg(_req.params.catname);
    res.json(ProductList);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const product_routes = (app: express.Application) => {
  app.get('/product', index);
  app.get('/product/:Prodid', show);
  app.post('/product/New', verifyAuthToken, create);
  app.get('/products/topfv', topfive);
  app.get('/products/cat/:catname', showbycatg);
};
export default product_routes;
