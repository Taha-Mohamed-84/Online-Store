import { productstor } from '../../models/products_m';

const stor = new productstor();

describe('product Model', async () => {
  it('should have an index method', () => {
    expect(stor.index).toBeDefined;
  });
  it('index method should return a list of products ', async () => {
    const Result = await stor.index();
    expect(Result.length).toEqual(1);
  });

  it('should have a create method', () => {
    expect(stor.create).toBeDefined;
  });
  it('create method add new product', async () => {
    const Result = await stor.create({
      prodid: 1,
      prodname: 'prod 1',
      prodprice: 33,
      prodcategory: 'cat 1'
    });
    expect(Result.prodid).toBeTruthy
  });

  it('should have a show method', () => {
    expect(stor.show).toBeDefined;
  });
  it('show method should return a one product ', async () => {
    const Result = await stor.show('1');
    expect(Result.length).toBe(1);
  });
});
