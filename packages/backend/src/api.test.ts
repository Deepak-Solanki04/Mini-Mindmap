import request from 'supertest';
import app from './index';
import { clearDatabaseForTests } from './db';

describe('API Endpoints', () => {
  beforeEach(() => {
    process.env.MOCK_MODE = 'true';
    process.env.NODE_ENV = 'test';
    clearDatabaseForTests();
  });

  it('POST /api/mindmaps creates a new mindmap', async () => {
    const res = await request(app)
      .post('/api/mindmaps')
      .send({ text: 'this is a sufficiently long string for testing the API endpoint properly' });
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Mock Mindmap');
    expect(res.body.id).toBeDefined();
  });

  it('GET /api/mindmaps returns list of mindmaps', async () => {
    await request(app)
      .post('/api/mindmaps')
      .send({ text: 'this is a sufficiently long string for testing the API endpoint properly' });
    
    const res = await request(app).get('/api/mindmaps');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it('GET /api/mindmaps/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/mindmaps/invalid-id');
    expect(res.status).toBe(404);
  });
});
