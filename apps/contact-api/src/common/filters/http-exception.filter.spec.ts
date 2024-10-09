import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionFilter', () => {
  let service: AllExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionFilter]
    }).compile();

    service = module.get<AllExceptionFilter>(AllExceptionFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return HTTP status code and message for non-HttpException', () => {
    const filter = new AllExceptionFilter();
    const host: any = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      })
    };
    const exception = new Error('Test error');
    filter.catch(exception, host);
    expect(host.getResponse().status).toHaveBeenCalledWith(500);
    expect(host.getResponse().json).toHaveBeenCalledWith({
      code: 500,
      time: expect.any(String),
      message: 'Test error'
    });
  });
  
  it('should return INTERNAL_SERVER_ERROR when exception is not HttpException', () => {
    const filter = new AllExceptionFilter();
    const host: any = {
        switchToHttp: jest.fn().mockReturnThis(),
        getResponse: jest.fn().mockReturnValue({
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        })
    };
    const exception = {};
    filter.catch(exception, host);
    expect(host.getResponse().status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
});
  
    // Tests that the response contains a timestamp
    it('should return timestamp in response', () => {
        const mockException = new HttpException('Test exception', HttpStatus.BAD_REQUEST);
        const mockHost: any = {
            switchToHttp: jest.fn().mockReturnThis(),
            getResponse: jest.fn().mockReturnValue({
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            })
        };
        const filter = new AllExceptionFilter();
        filter.catch(mockException, mockHost);
        expect(mockHost.getResponse().json).toHaveBeenCalledWith(expect.objectContaining({
            time: expect.any(String)
        }));
    });
});
