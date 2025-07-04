import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a user and return a JWT token', async () => {
      const userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'userId',
        ...userData,
        password: 'hashed-password',
      });
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
        'hashed-password',
      );
      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'jwt-token');

      const token = await service.signup(
        userData.username,
        userData.email,
        userData.password,
      );
      expect(token.access_token).toBe('jwt-token');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const user = {
        id: 'userId',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'jwt-token');

      const result = await service.login(user.email, 'password');
      expect(result.access_token).toBe('jwt-token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login('usr@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        id: 'userId',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      await expect(service.login(user.email, 'noPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getMe', () => {
    it('should return user data', async () => {
      const user = {
        id: 'userId',
        username: 'testUser',
        email: 'test@example.com',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.getMe(user.id);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getMe('id');
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    const userId = 'userId';
    const existingUser = {
      id: userId,
      username: 'oldUser',
      email: 'old@example.com',
      password: 'hashed-password',
    };

    it('should update user data when old password is correct', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...existingUser,
        username: 'newUser',
        email: 'new@example.com',
      });

      const updateData = {
        username: 'newUser',
        email: 'new@example.com',
        oldPassword: 'correct-password',
        newPassword: undefined,
      };

      const result = await service.updateProfile(userId, updateData);
      expect(result.username).toBe('newUser');
      expect(result.email).toBe('new@example.com');
    });

    it('should throw error if old password is incorrect', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      const updateData = {
        username: 'newUser',
        email: 'new@example.com',
        oldPassword: 'password',
        newPassword: undefined,
      };

      await expect(service.updateProfile(userId, updateData)).rejects.toThrow();
    });
  });
});
