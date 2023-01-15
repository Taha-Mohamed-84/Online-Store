import supertest from 'supertest';
import app from '../../index'

const request = supertest(app);
describe('Users handlers', async () => {
  it("Should save user to database -- create", async ()=> {
    const res = await request.post("/users").send({
      firstName:"test name",
      lastName:"test last name",
      user_name:"test user",
      password:"123"
    });
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy
  });

  let testUserToken:string

  it("Should log in user  -- sign in", async  ()=> {
    const res = await request.get("/signin").query({ user_name: 'test user',password: '123' });
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
    testUserToken=res.body
  });


  it("Should get user by id ", async  ()=> {
    const res=await( request.get("/users/1")).set('Authorization', testUserToken)
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
    expect(res.body.length).toBe(1);
    expect(JSON.stringify(res.body).includes('id')).toBeTruthy
  });

  it("Should get all users", async  ()=> {
    const res=await( request.get("/users")).set('Authorization', testUserToken)
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(res.body).includes('id')).toBeTruthy
  });

})

