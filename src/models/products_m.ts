import client from '../database';

export type product_t = {
  prodid: number;
  prodname: string;
  prodprice: number;
  prodcategory: string;
};

export class productstor {
  async index(): Promise<product_t[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products_t ORDER BY ProdID ';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot connect ${err}`);
    }
  }

  async show(ProdID: string): Promise<product_t[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products_t where ProdID=($1) ';
      const result = await conn.query(sql, [ProdID]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot find product ${err}`);
    }
  }

  async showTop5(): Promise<product_t[]> {
    try {
      const conn = await client.connect();
      const sql =
        'select  sum(ordet_prod_qyt)totqyt ,ordet_product_id  \
    ,products_t.prodname,MAX(products_t.prodprice)maxpric from order_details_t \
left join products_t on products_t.prodid=order_details_t.ordet_product_id \
group by ordet_product_id ,products_t.prodname \
Order By totqyt desc \
limit 5 ';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot find product ${err}`);
    }
  }

  async create(prod: product_t): Promise<product_t> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products_t (prodid,prodname, prodprice, prodcategory) VALUES (DEFAULT,$1, $2,$3) RETURNING *';
      const result = await conn.query(sql, [
        prod.prodname,
        prod.prodprice,
        prod.prodcategory
      ]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable create product ${prod.prodname} : ${err} `);
    }
  }

  async product_status(product_id: number): Promise<product_t[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products_t where prodid=($1)  ';
      const result = await conn.query(sql, [product_id]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`cannot find product ${err}`);
    }
  }

  async showbycatg(ProdCatg: string): Promise<product_t[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products_t where prodcategory=($1) ';
      const result = await conn.query(sql, [ProdCatg]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot find product ${err}`);
    }
  }
}
