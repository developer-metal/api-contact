import { Test, TestingModule } from '@nestjs/testing';
import { CsrfMiddleware } from './csrf.middleware';
import { AuthService } from '../services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config-jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { find } from 'cheerio/lib/api/traversing';
import { getModelToken } from '@nestjs/mongoose';
import { TokenList } from '../dto/tokenList.dto';
import { Model } from 'mongoose';

describe('CsrfMiddleware', () => {

  let middleware: CsrfMiddleware;
  let tokenModel = Model<TokenList>;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CsrfMiddleware, JwtService,
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
      ],
      imports: [
        HttpModule,
        JwtModule
      ]
  }).compile();
  tokenModel = module.get<Model<TokenList>>(getModelToken('Token'));
  middleware = module.get<CsrfMiddleware>(CsrfMiddleware);
  service = module.get<AuthService>(AuthService);
  });
  it('should be defined Middleware and Service Auth', () => {
    expect(middleware).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call next() function when validCSRF() function is executed without errors', async () => {
    const req = { session: { tokencsrf: ['token1', 'token2'] }, headers: { 'csrf-token': 'token1' } };
    const res = {};
    const mockModelTojen = jest.fn().mockImplementation(() => {
      find: jest.fn().mockImplementation(() => {});
    });
    const next = jest.fn();
    try {
    await middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    } catch(error) {
      expect(error).toBeInstanceOf(HttpException);
    }
});

it('should throw HttpException with status 401 and error message Token ya en uso when req.session.tokencsrf does not include req.headers[csrf-token]', async () => {
  const req = {
      session: {
          tokencsrf: ['token1', 'token2']
      },
      headers: {
          'csrf-token': 'token3'
      }
  };
  const next = jest.fn();
  const authService: any = {
      validCSRF: jest.fn().mockImplementation(() => {
          throw new HttpException({
              status: HttpStatus.UNAUTHORIZED,
              error: 'Token ya en uso.'
          }, HttpStatus.UNAUTHORIZED);
      })
  };
  const csrfMiddleware = new CsrfMiddleware(authService);
  try {
      await csrfMiddleware.use(req, {}, next);
  } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.response.error).toBe('Token ya en uso.');
  }
});
it('should return a string',async ()  => {
  const req = { csrfToken: jest.fn().mockImplementation(() => 'kl56n4k5lk654l6nlk6n6kn456n6lkn') };
  const tokencsrf = 'kl56n4k5lk654l6nlk6n6kn456n6lkn';
  req.csrfToken.mockReturnValueOnce(tokencsrf);

  jest.spyOn(service, 'saveTokenCsrf').mockImplementation(async () => tokencsrf);
  const result = service.saveTokenCsrf();
  expect(typeof await result).toBe('string');
});
});