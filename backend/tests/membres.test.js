const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

let emailTest = `test${Date.now()}@example.com`;

describe('Test membres', () => {

  it('Doit créer un utilisateur', async () => {
    const res = await request(app)
      .post('/api/membres/inscription')
      .send({
        nom: 'Test',
        prenom: 'User',
        email: emailTest,
        mot_de_passe: 'Test1234',
        date_naissance: '2000-01-01'
      });

    expect(res.statusCode).toBe(201);
  });

  it('Doit connecter un utilisateur', async () => {
    const res = await request(app)
      .post('/api/membres/connexion')
      .send({
        email: emailTest,
        mot_de_passe: 'Test1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

});

afterAll(async () => {
  await db.end();
});