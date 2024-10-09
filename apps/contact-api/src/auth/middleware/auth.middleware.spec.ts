import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from '../services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config-jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
  describe('AuthMiddleware', () => {
    let service: AuthService;
    let serviceJwt: JwtService;
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [AuthService, JwtService,
            { 
              provide: getModelToken('Token'), 
              useValue: {
                updateOne: jest.fn(),
                findOne: jest.fn(),
                findById: jest.fn(),
                exec: jest.fn(),
                promise: jest.fn()
              }
          }],
          imports: [
            HttpModule,
            JwtModule
          ]
      }).compile();
        service = module.get<AuthService>(AuthService);
        serviceJwt = module.get<JwtService>(JwtService);
  });
  it('should be defined Auth Service', () => {
    expect(service).toBeDefined();
  });

  it('should call validJwt method of AuthService when middleware is used', async () => {
    const authMiddleware = new AuthMiddleware(service);
    const headers = { authorization: 'Bearer fdfdfdgf.fdfdfdf.c5dII6R4dC5IlhJyhhHkWGPqVzgHzE40ecZWogdfdgdgdfgdfgfgfdgdfgdf-XqD70' };
    const req = { headers };
    const next = jest.fn();
    const validJwtSpy = jest.spyOn(service, 'validJwt').mockImplementation(() => Promise.resolve(true));

    await authMiddleware.use(req, {}, next);

    expect(validJwtSpy).toHaveBeenCalledWith(headers);
    expect(next).toHaveBeenCalled();
});

it('should call next function when validJwt is successful', async () => {
  const mockNext = jest.fn().mockResolvedValue(true);
  expect(mockNext).toBeDefined();
});

it('should throw an HttpException when headers are undefined', async () => {
  const req = {};
  const res = {};
  const next = jest.fn();
  const authMiddleware = new AuthMiddleware(service);
  await expect(authMiddleware.use(req, res, next)).rejects.toThrow(HttpException);
});
it('should throw HttpException when token is undefined', async () => {
  const req = { headers: {} };
  const res = {};
  const next = jest.fn();
  const authMiddleware = new AuthMiddleware(service);
  await expect(authMiddleware.use(req, res, next)).rejects.toThrow(HttpException);
});
it('should throw an HttpException when the token is invalid', async () => {
  const authMiddleware = new AuthMiddleware(service);
  const headers = { authorization: 'Bearer invalidToken' };
  const req = { headers };
  const res = {};
  const next = jest.fn();
  await expect(authMiddleware.use(req, res, next)).rejects.toThrow(HttpException);
});

it('should throw an HttpException when the token is not in session', async () => {
  const req = { session: { tokencsrf: [] } };
  const res = {};
  const next = jest.fn();
  const authMiddleware = new AuthMiddleware(service);
  try {
      await authMiddleware.use(req, res, next);
  } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.response.error).toBe('Unauthorized');
  }
});
});
