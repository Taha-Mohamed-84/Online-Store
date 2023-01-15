import client from '../database';

export type order_t = {
  order_id: number;
  order_status: string;
  user_id: number;
};

export type order_details_t = {
  ordet_id: number;
  ordet_prod_qyt: number;
  ordet_prod_price: number;
  ordet_prod_total: number;
  ordet_order_id: number;
  ordet_product_id: number;
  ordet_user_id: number;
};
export class orderstor {
  async index(userid: number): Promise<order_t[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from orders_t where user_id=($1)  ORDER BY ProdID ';
      const result = await conn.query(sql, [userid]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot connect ${err}`);
    }
  }

  async create(ord: order_t): Promise<order_t> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO orders_t (order_id,order_status, user_id) VALUES (DEFAULT,$1,$2 ) RETURNING *';
      const result = await conn.query(sql, [ord.order_status, ord.user_id]);
      const NewOrder = result.rows[0];
      conn.release();
      return NewOrder;
    } catch (err) {
      throw new Error(`unable create order to user ${ord.user_id} : ${err} `);
    }
  }

  async Order_status(
    UserID: number,
    ord_status: string,
    ord_id?: number
  ): Promise<order_t[]> {
    try {
      let tempOrdId = ' ';
      if (!ord_id === false) {
        tempOrdId = ' AND  order_id = ' + ord_id;
      }
      const conn = await client.connect();
      const sql = `select * from orders_t where user_id=($1) and order_status=($2) ${tempOrdId} ORDER BY order_id,order_status `;

      const result = await conn.query(sql, [UserID, ord_status]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot find order ${err}`);
    }
  }

  async update_Order_status(
    ord_status: string,
    UserID: number,
    ord_id: number
  ): Promise<order_t> {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE  orders_t set order_status=($1) WHERE  user_id=($2) and order_id=($3)  RETURNING *';
      const result = await conn.query(sql, [ord_status, UserID, ord_id]);
      const NewOrder = result.rows[0];
      conn.release();
      return NewOrder;
    } catch (err) {
      throw new Error(`unable  to update order ${ord_id} : ${err} `);
    }
  }

  async addToOrder(ordDetail: order_details_t): Promise<order_t> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO order_details_t (ordet_id,ordet_prod_qyt, ordet_prod_price,ordet_prod_total,ordet_order_id,ordet_product_id,ordet_user_id) VALUES (DEFAULT,$1,$2,$3,$4,$5,$6 ) RETURNING *'; //RETURNING';
      const result = await conn.query(sql, [
        ordDetail.ordet_prod_qyt,
        ordDetail.ordet_prod_price,
        ordDetail.ordet_prod_total,
        ordDetail.ordet_order_id,
        ordDetail.ordet_product_id,
        ordDetail.ordet_user_id
      ]);
      const NewOrderDetail = result.rows[0];
      conn.release();
      return NewOrderDetail;
    } catch (err) {
      throw new Error(
        `unable to add product ${ordDetail.ordet_product_id} to order  ${ordDetail.ordet_order_id} : ${err} `
      );
    }
  }

  async show(UserID: number, ord_status: string): Promise<order_t[]> {
    try {
      const conn = await client.connect();
      const sql =
        '	SELECT * FROM  orders_t LEFT JOIN order_details_t ON order_details_t.ordet_order_id = orders_t.order_id  WHERE   orders_t.user_id=($1)  and  orders_t.order_status=($2) ';
      const result = await conn.query(sql, [UserID, ord_status]);

      return result.rows;
    } catch (err) {
      throw new Error(`unable  to Find order for user ${UserID} : ${err} `);
    }
  }
}
