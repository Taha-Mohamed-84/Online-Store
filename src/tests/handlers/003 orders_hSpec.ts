import supertest from 'supertest';
import app from '../../index'

const request = supertest(app);



describe('orders handlers', async () => {
  let testUserToken:string
  beforeAll(async () => {
    const res = await request.get("/signin").query({ user_name: 'test user',password: '123' });
    testUserToken=res.body
  });

  it("Should save order to database -- create", async ()=> {
     const res = await request.post("/orders/new/").set('Authorization', testUserToken); 
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy
  });

  it("Should Add product to Order", async ()=> {
    const res = await request.post("/orders/1/Product/1").send({
     ProductQTY:4
   }).set('Authorization', testUserToken); 
   expect(res.status).toBe(200);
   expect(res.body.id).toBeTruthy
 });

 it("Should Show current Order", async ()=> {
  const res = await request.get("/orders/current/").set('Authorization', testUserToken); 
 expect(res.status).toBe(200);
 expect(res.body[0].ordet_prod_total).toBeTruthy
});


it("Should Change Order Status", async ()=> {
  const res = await request.put("/orders/paying/1").set('Authorization', testUserToken); 
 expect(res.status).toBe(200);
 expect(res.body.order_status).toBe('complete')
});


it("Should Show completed Order", async ()=> {
  const res = await request.get("/orders/done/").set('Authorization', testUserToken); 
 expect(res.status).toBe(200);
 expect(res.body[0].ordet_prod_total).toBeTruthy
});

})

