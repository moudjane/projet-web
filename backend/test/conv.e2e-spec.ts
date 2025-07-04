import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitmqService } from '../src/rabbitmq/rabbitmq.service';
import * as bcrypt from 'bcrypt';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.test' });

describe('Conversation', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let userId: string;
  let targetUserId: string;

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

    const passwordHash = await bcrypt.hash('password', 10);

    const user = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        password: passwordHash,
      },
    });

    const targetUser = await prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        password: passwordHash,
      },
    });

    userId = user.id;
    targetUserId = targetUser.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(email: "user1@example.com", password: "password")
          }
        `,
      });

    jwtToken = loginResponse.body.data.login;
  });

  it('should create a conversation between two users', async () => {
    const mutation = `
  mutation {
    createConversation(title: "Test Conversation", targetUserId: "${targetUserId}") {
      id
      title
      users {
        id
        username
      }
    }
  }
`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ query: mutation })
      .expect(200);

    const conversation = response.body.data.createConversation;
    expect(conversation).toBeDefined();
    expect(conversation.title).toBe('Test Conversation');
    expect(conversation.users).toHaveLength(2);
    expect(conversation.users.map((u) => u.id)).toEqual(
      expect.arrayContaining([userId, targetUserId]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
