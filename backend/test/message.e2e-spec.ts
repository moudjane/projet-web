import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Message', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let userId: string;
  let targetUserId: string;
  let conversationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Test Conversation',
        users: {
          connect: [{ id: userId }, { id: targetUserId }],
        },
      },
    });
    conversationId = conversation.id;

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

  it('should send a message in a conversation', async () => {
    const mutation = `
  mutation {
    sendMessage(
      content: "It's a test!",
      conversationId: "${conversationId}"
    ) {
      id
      content
      user {
        id
        username
      }
      createdAt
    }
  }
`;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ query: mutation })
      .expect(200);

    const message = response.body.data.sendMessage;
    expect(message).toBeDefined();
    expect(message.content).toBe('It\'s a test!');
    expect(message.user.id).toBe(userId);
  });

  afterAll(async () => {
    await app.close();
  });
});
