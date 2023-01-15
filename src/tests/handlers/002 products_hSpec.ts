import supertest from 'supertest';
import app from '../../index'

const request = supertest(app);

describe('products handlers', async () => {
  let testUserToken:string
  beforeAll(async () => {
    const res = await request.get("/signin").query({ user_name: 'test user',password: '123' });
    testUserToken=res.body
  });


  it("Should save product to database -- create", async ()=> {
     const res = await request.post("/product/New").send({
      name:"product name",
      price:10,
      category:"product category"
    }).set('Authorization', testUserToken); 
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy
  });

  it("Should index all products", async  ()=> {
    const res =  await request.get("/product");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(res.body).includes('id')).toBeTruthy

  });


  it("Should get product by id ", async  ()=> {
     const res=await(request.get("/product/1"))
     expect(res.status).toBe(200);
     expect(res.body).toBeTruthy
     expect(res.body.length).toBe(1);
     expect(JSON.stringify(res.body).includes('id')).toBeTruthy
  });

  it("Should Get top 5 products", async  ()=> {
    const res =  await request.get("/products/topfv");
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
  });

  it("Should get product by category ", async  ()=> {
    const res=await(request.get("/products/cat/product category"))
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(res.body).includes('id')).toBeTruthy
 });
})

