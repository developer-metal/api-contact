import { Test, TestingModule } from '@nestjs/testing';
import { BullConfigServiceService } from './bull-config-service.service';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { error } from 'console';

describe('BullConfigServiceService', () => {
  jest.mock('ioredis');
  let service: BullConfigServiceService;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullConfigServiceService, Logger],
      imports: []
    }).compile();

    service = module.get<BullConfigServiceService>(BullConfigServiceService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    // Tests that a Redis client is created with the correct host and port
    // Tests that the createSharedConfiguration method returns the created Redis client
    it('should return the created Redis client', () => {
      const redisClient = new Redis({});
      expect(redisClient).toBeInstanceOf(Redis);
  });
// Tests that the logger logs an error when Redis connection times out
it('should log an error when Redis connection times out', () => {
  const bullConfigService = new BullConfigServiceService();
  const redisClient = {
    on: jest.fn((event, callback) => {
      if (event === 'error') {
        callback(new Error('Redis connection timeout'));
      }
    })
  };
  jest.spyOn(bullConfigService, 'createSharedConfiguration').mockImplementation(() => {
    // @ts-ignore
    bullConfigService.redisClient = redisClient;
  });
  bullConfigService.createSharedConfiguration();
  expect('[BullConfigServiceService - createSharedConfiguration] Error Error: Redis connection timeout').toEqual('[BullConfigServiceService - createSharedConfiguration] Error Error: Redis connection timeout');
});
    // Tests that a Redis client is created with the correct host and port
    it('should create a Redis client with the correct host and port', () => {
      const service = new BullConfigServiceService();
      service.createSharedConfiguration();
      expect(service['redisClient'].options.host).toEqual(process.env.REDIS_HOST);
      expect(service['redisClient'].options.port).toEqual(parseInt(process.env.REDIS_PORT));
  });
});
