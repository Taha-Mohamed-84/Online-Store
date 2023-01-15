import express, { Request, Response, NextFunction } from 'express';
import { Userst, userstor } from '../models/users_m';
import jwt from 'jsonwebtoken';

const stor = new userstor();

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
  try { // reviews #4 Requirements
    const usersList = await stor.index();
    res.json(usersList);
  } catch (error) {
    res.status(401);
    res.json(`Cannot Provide Users list ${error}`);
  }
};

const create = async (_req: Request, res: Response) => {
  const users: Userst = {
    firstname: _req.body.firstName,
    lastname: _req.body.lastName,
    user_name: _req.body.user_name,
    password: _req.body.password,
    id: _req.body.id
  };

  try {
    const newUser = await stor.create(users);
    newUser.password = '';
    res.json(newUser);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const show = async (_req: Request, res: Response) => {
  if (!_req.params.userid || !parseInt(_req.params.userid as string)) {
    res.status(400);
    res.json('Please Enter A Valid ID');
    return;
  }

  try {
    const user = await stor.show(parseInt(_req.params.userid as string));
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const authenticate_login = async (_req: Request, res: Response) => {
  let QurUname: string = '';
  let QurUpass: string = '';
  if (!_req.query.user_name) {
    res.status(400);
    res.json('User Name Not provided');
    return;
  } else {
    QurUname = _req.query.user_name as string;
  }
  if (!_req.query.password) {
    res.status(400);
    res.json('User Password Not provided');
    return;
  } else {
    QurUpass = _req.query.password as string;
  }
  try {
    const Getuser = await stor.authenticate(QurUname, QurUpass);
    if (Getuser) {
      Getuser.password = '';
      const token = jwt.sign(
        { Getuser },
        process.env.Token_PASS as unknown as string
      );
      res.status(200);
      res.json(token);
    } else {
      res.status(403);
      res.json('Wrong Username Or Password');
      return;
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const users_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:userid', verifyAuthToken, show);
  app.post('/users', create);
  app.get('/signin', authenticate_login);
};
export default users_routes;
