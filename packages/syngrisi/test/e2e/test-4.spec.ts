import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';

const baseURL = 'http://localhost:3000';
const mongoURL = 'mongodb://localhost/myapp';

test.beforeAll(async () => {
  // Подключение к базе данных перед выполнением всех тестов
  const client = await MongoClient.connect(mongoURL);
  await client.close();
});


test.beforeEach(async () => {
  setup: {
    
  }
  // Очистка базы данных перед каждым тестом
  const client = await MongoClient.connect(mongoURL);
  const db = client.db();
  await db.collection('users').deleteMany({});
  await client.close();
});

test('Регистрация нового пользователя', async ({ request }) => {
  const email = `test${Date.now()}@example.com`;
  const response = await request.post(`${baseURL}/register`, {
    data: {
      name: 'John Doe',
      email,
      password: 'password123',
    },
  });

  expect(response.status()).toBe(201);
  expect(await response.json()).toHaveProperty('_id');
});

test('Регистрация пользователя с существующим email', async ({ request }) => {
  const email = `test${Date.now()}@example.com`;
  await request.post(`${baseURL}/register`, {
    data: {
      name: 'John Doe',
      email,
      password: 'password123',
    },
  });

  const response = await request.post(`${baseURL}/register`, {
    data: {
      name: 'Jane Doe',
      email,
      password: 'password456',
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Пользователь с таким email уже существует' });
});

test('Аутентификация пользователя', async ({ request }) => {
  const email = `test${Date.now()}@example.com`;
  await request.post(`${baseURL}/register`, {
    data: {
      name: 'John Doe',
      email,
      password: 'password123',
    },
  });

  const response = await request.post(`${baseURL}/login`, {
    data: {
      email,
      password: 'password123',
    },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toHaveProperty('token');
});

test('Аутентификация пользователя с неверными учетными данными', async ({ request }) => {
  const email = `test${Date.now()}@example.com`;
  await request.post(`${baseURL}/register`, {
    data: {
      name: 'John Doe',
      email,
      password: 'password123',
    },
  });

  const response = await request.post(`${baseURL}/login`, {
    data: {
      email,
      password: 'wrongpassword',
    },
  });

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'Неверные учетные данные' });
});

test('Получение списка всех пользователей с JWT токеном', async ({ request }) => {
  const email = `test${Date.now()}@example.com`;
  await request.post(`${baseURL}/register`, {
    data: {
      name: 'John Doe',
      email,
      password: 'password123',
    },
  });

  const loginResponse = await request.post(`${baseURL}/login`, {
    data: {
      email,
      password: 'password123',
    },
  });
  const { token } = await loginResponse.json();

  const response = await request.get(`${baseURL}/users`, {
    headers: {
      Authorization: token,
    },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toBeInstanceOf(Array);
});

test('Получение списка всех пользователей без JWT токена', async ({ request }) => {
  const response = await request.get(`${baseURL}/users`);

  expect(response.status()).toBe(401);
});
