import { SharedBullConfigurationFactory } from '@nestjs/bull';
import Redis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BullConfigServiceService
  implements SharedBullConfigurationFactory
{
  public readonly logger = new Logger();
  private redisClient: Redis;
  createSharedConfiguration(): any {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    });
    this.redisClient.on('error', (error) => {
      this.logger.error(
        `[BullConfigServiceService - createSharedConfiguration] Error ${error}`
      );
    });
  }
}
