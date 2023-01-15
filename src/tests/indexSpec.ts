import app from '../index';
import supertest from 'supertest';

const request = supertest(app);
describe('Test Connection OK', () => {
  it('gets the app endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
