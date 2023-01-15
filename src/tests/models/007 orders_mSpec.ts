import { orderstor } from '../../models/orders_m';

const stor = new orderstor();

describe('order Model', async () => {
  it('should have an index method', () => {
    expect(stor.index).toBeDefined;
  });

  it('should have a create method', () => {
    expect(stor.create).toBeDefined;
  });
  it('create method add new Order', async () => {
    const Result = await stor.create({
      order_id: 1,
      order_status: 'active',
      user_id: 1
    });

    expect(Result.order_id).toBeTruthy
  });

  it('should have a show method', () => {
    expect(stor.show).toBeDefined;
  });
  it('show method should return a one active Order (Current Order by user)', async () => {
    const Result = await stor.show(1, 'active');
    expect(Result.length).toBe(1);
  });
});
