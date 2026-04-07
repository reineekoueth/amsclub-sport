// tests/membres.test.js
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import api from '../src/services/api.js'; // ton instance axios

let mock;

// Mock global de localStorage pour Node.js
beforeAll(() => {
  global.localStorage = {
    getItem: (key) => (key === 'token' ? 'fake-jwt-token' : null),
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
});

afterAll(() => {
  delete global.localStorage;
});

describe('Test Membres (frontend)', () => {
  beforeEach(() => {
    mock = new AxiosMockAdapter(api);
  });

  afterEach(() => {
    if (mock) mock.restore();
  });

  it('Doit créer un utilisateur avec JWT', async () => {
    const newUser = { id: 1, name: 'Alice', email: 'alice@test.com' };

    // Mock la requête POST /membres
    mock.onPost('/membres').reply((config) => {
      // Vérifie que le header Authorization contient le JWT
      expect(config.headers.Authorization).toBe('Bearer fake-jwt-token');
      return [201, newUser];
    });

    const response = await api.post('/membres', newUser).then(res => res.data);
    expect(response).toEqual(newUser);
  });

  it('Doit connecter un utilisateur et renvoyer un token', async () => {
    const loginResponse = { token: 'fake-jwt-token' };
    const credentials = { email: 'alice@test.com', password: '123456' };

    // Mock la requête POST /membres/login
    mock.onPost('/membres/login').reply((config) => {
      // Vérifie que le header Authorization contient le JWT
      expect(config.headers.Authorization).toBe('Bearer fake-jwt-token');
      return [200, loginResponse];
    });

    const response = await api.post('/membres/login', credentials).then(res => res.data);
    expect(response).toHaveProperty('token');
    expect(response.token).toBe('fake-jwt-token');
  });
});