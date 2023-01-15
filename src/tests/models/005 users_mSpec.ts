import { userstor } from '../../models/users_m';
const stor = new userstor();

describe('Users Model', async () => {
  it('should have an index method', () => {
    expect(stor.index).toBeDefined;
  });
  it('index method should return a list of Users ', async () => {
    const Result = await stor.index();
    expect(Result.length).toBeGreaterThanOrEqual(0);
  });

  it('should have a create method', () => {
    expect(stor.create).toBeDefined;
  });
  it('create method add new user ', async () => {
    const Result = await stor.create({
      id: 1,
      firstname: 'TestName',
      lastname: 'TestLastName',
      user_name: 'TestUserName',
      password: 'TestPassword'
    });
    expect(Result.id).toBeTruthy
  });

  it('should have a show method', () => {
    expect(stor.show).toBeDefined;
  });
  it('show method should return a one User ', async () => {
    const Result = await stor.show(1);
    expect(Result.length).toBe(1);
  });
});
