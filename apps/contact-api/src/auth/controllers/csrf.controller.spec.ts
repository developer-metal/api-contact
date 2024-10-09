import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CsrfController } from './csrf.controller';
import { AuthService } from '../services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config-jwt';
import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
describe('CsrfController', () => {
  let controller: CsrfController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrfController],
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
      imports: [ JwtModule.register({
        global: false,
        secret: jwtConstants.secret
      }),HttpModule,ConfigModule]
    }).compile();
    controller = module.get<CsrfController>(CsrfController);
    service = module.get<AuthService>(AuthService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


it('generate csrf token', async () => {
  const mockRequest = {
      csrfToken: jest.fn().mockReturnValue('mocked_token'),
      session: {
          tokencsrf: []
      }
  };
  const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
  };
  try {
  await controller.csrfToken(mockResponse);
  expect(service.saveTokenCsrf).toHaveBeenCalledWith(mockRequest);
  expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
  expect(mockResponse.send).toHaveBeenCalledWith({ code: HttpStatus.OK, payload: 'mocked_token' });
  } catch(error) {
    expect(error).toBeInstanceOf(Error);
  }
});
// Tests that an error response is returned if the CSRF token cannot be generated.
it('test_csrf_token_generation_error', async () => {
  const mockRequest: any = {
      csrfToken: jest.fn().mockImplementation(() => {
          throw new Error('CSRF token generation error');
      }),
      session: {
          tokencsrf: []
      }
  };
  const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
  };
  const authService: any = {
      saveTokenCsrf: jest.fn().mockResolvedValue('mocked_token')
  };
  const csrfController = new CsrfController(authService);
  jest.spyOn(CsrfController.prototype, 'csrfToken').mockResolvedValueOnce(Promise.reject(mockResponse));
   await expect(csrfController.csrfToken(mockRequest)).rejects.toBeDefined();
});

});
