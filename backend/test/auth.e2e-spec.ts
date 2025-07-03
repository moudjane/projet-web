import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitmqService } from '../src/rabbitmq/rabbitmq.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.test' });

describe('Auth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RabbitmqService)
      .useValue({
        sendToQueue: jest.fn().mockResolvedValue(undefined),
        consumeMessages: jest.fn().mockResolvedValue(undefined),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
  });

  it('signup mutation should return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            signup(username: "testuser", email: "test@example.com", password: "password")
          }
        `,
      })
      .expect(200);

    expect(response.body.data.signup).toBeDefined();
  });

  it('login mutation should return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(email: "test@example.com", password: "password")
          }
        `,
      })
      .expect(200);

    expect(response.body.data.login).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
