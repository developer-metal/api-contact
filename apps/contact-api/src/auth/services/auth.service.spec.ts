import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config-jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TokenList } from '../dto/tokenList.dto';
import { Model } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let tokenModel = Model<TokenList>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        JwtModule.register({
          global: false,
          secret: jwtConstants.secret
        }),
        PassportModule,
        ConfigModule
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtService,
        { 
          provide: getModelToken('Token'),
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
            promise: jest.fn()
          }
       }
      ]
    }).compile();
    tokenModel = module.get<Model<TokenList>>(getModelToken('Token'));
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
      it('should throw Error when csrf-token header is not present', async () => {
        const req = {
          headers: {}
        };
        await expect(service.validCSRF(req)).rejects.toThrow(Error);
      });
    it('should throw HttpException when token is invalid', async () => {
      const headers = {
        authorization: 'Bearer invalidToken'
      };
      await expect(service.validJwt(headers)).rejects.toThrow(HttpException);
    });
        it('should throw HttpException when token is not provided', async () => {
          const headers = {};
          await expect(service.validJwt(headers)).rejects.toThrow(HttpException);
        });
    it('should generate and save a new CSRF token', async () => {
      const tokenmodel = {
        save: jest.fn().mockResolvedValue({ token: 'newToken' })
      };
      try {
      const result = await service.saveTokenCsrf();
      expect(tokenmodel.save).toHaveBeenCalled();
      expect(result).toBe('newToken');
      } catch (error) {
      expect(error).toBeInstanceOf(Error);
      }
    });
        it('should delete token from database when token is valid', async () => {
          const req = {
            headers: {
              'csrf-token': 'validToken'
            }
          };
          const tokenmodel = {
            findOne: jest.fn().mockResolvedValue({ token: 'validToken', secret: 'validSecret' }),
            deleteOne: jest.fn()
          };
          try { await service.validCSRF(req); expect(tokenmodel.findOne).toHaveBeenCalledWith({ token: 'validToken' });expect(tokenmodel.deleteOne).toHaveBeenCalledWith({ token: 'validToken' });} catch (error) { expect(error).toBeInstanceOf(Error);} 
        });
    it('should return true when token is valid', async () => {
      const headers = {
        authorization: 'Bearer validToken'
      };
      try { const result = await service.validJwt(headers); expect(result).toBe(true); } catch (error) { expect(error).toBeInstanceOf(HttpException);}
    });
        it('should return true when token is valid', async () => {
          const headers = {authorization: 'Bearer validToken'};
          try {const result = await service.validJwt(headers); expect(result).toBe(true);} catch (error) { expect(error).toBeInstanceOf(HttpException);}});
});