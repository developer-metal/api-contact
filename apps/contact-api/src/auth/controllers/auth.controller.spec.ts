import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from '../../config/config-jwt';
import { JwtModule } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenList } from '../dto/tokenList.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let tokenmodel = Model<TokenList>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
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
      imports: [HttpModule,
        JwtModule.register({
          global: false,
          secret: jwtConstants.secret
        }),
        ConfigModule
      ],
      controllers: [AuthController]
    }).compile();
    tokenmodel = module.get<Model<TokenList>>(getModelToken('Token'));
    controller = module.get<AuthController>(AuthController);
  });
        it('success 200', async () => {
          const authController = new AuthController();
          await authController.healthcheck({
              status: function (statusCode) {
                  expect(statusCode).toBe(HttpStatus.OK);
                  return {
                      send: function (responseBody) {
                          expect(responseBody.code).toBe(HttpStatus.OK);
                          expect(responseBody.message).toBe('OK');
                          expect(responseBody.uptime).toBeDefined();
                          expect(responseBody.date).toBeDefined();
                      }
                  }
              }
          });
      });
      it('return correct message', () => {
        const authController = new AuthController();
        const response = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        authController.healthcheck(response);
        expect(response.send).toHaveBeenCalledWith({
            code: 200,
            uptime: expect.any(String),
            date: expect.any(String),
            message: 'OK'
        });
    });

it('Error 500 body', async () => {
  const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
  };
  const error = {
      response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: {
              code: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Error en la peticion.'
          }
      }
  };
  jest.spyOn(AuthController.prototype, 'healthcheck').mockResolvedValueOnce(Promise.reject(error));
  await expect(controller.healthcheck(response)).rejects.toBeDefined();
});

});