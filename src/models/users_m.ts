import client from '../database';
import bcrypt from 'bcrypt';

export type Userst = {
  id: number;
  firstname: string;
  lastname: string;
  user_name: string;
  password: string;
};

const { BECYPT_PASS, SALT_ROUNDS } = process.env;

export class userstor {
  async index(): Promise<Userst[]> {
    try {
      const conn = await client.connect();
      const sql =
        'select id,firstname,lastname,user_name from user_t ORDER BY id';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot connect ${err}`);
    }
  }

  async show(userID: number): Promise<Userst[]> {
    try {
      const conn = await client.connect();
      const sql =
        'select id,firstname,lastname,user_name from user_t WHERE id=($1) ORDER BY id';
      const result = await conn.query(sql, [userID]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot connect ${err}`);
    }
  }
  async create(u: Userst): Promise<Userst> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO user_t (firstName, lastName, user_name, password,id) VALUES ($1, $2,$3, $4, DEFAULT) RETURNING *'; //RETURNING';

      const hash = bcrypt.hashSync(
        u.password + BECYPT_PASS,
        parseInt(SALT_ROUNDS as unknown as string)
      );
      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        u.user_name,
        hash
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`unable create user ${u.user_name} : ${err} `);
    }
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<Userst | null> {
    try {
      const conn = await client.connect(); // الاتصال بقاعده البيانات
      const sql = 'SELECT * from user_t WHERE user_name=($1) ';
      const result = await conn.query(sql, [username]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BECYPT_PASS, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`unable authenticate user ${username} : ${err}`);
    }
  }
}
