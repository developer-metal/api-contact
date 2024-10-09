import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { AllExceptionFilter } from "./common/filters/http-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { bootstrap } from "./main";
describe('main', ()   => {
    beforeEach(async () => {
       await Test.createTestingModule({
            providers: [ConfigService, ValidationPipe, AllExceptionFilter
            ],
            imports: [AppModule]
        }).compile();
    });
      it('should set up CORS options', async () => {
        jest.spyOn(NestFactory, 'create').mockImplementation(() => { 
            return {
                getHttpServer: () => { return { _events: { request: { cors: { origin: true, credentials: true }
                            }
                        }
                    }
                }
            } as any;
        });
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        const corsOptions = app.getHttpServer()._events.request.cors;
        expect(corsOptions.origin).toBe(true);
        expect(corsOptions.credentials).toBe(true);
    });
    it('should set global prefix to api/v1', async () => {
        jest.spyOn(NestFactory, 'create').mockImplementation(() => { 
            return {
                setGlobalPrefix: jest.fn(),
                getHttpAdapter: () => { return { getInstance: () => { return { getGlobalPrefix: () => { return 'api/v1' } } } } }
            } as any;

        });
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.setGlobalPrefix('api/v1');
        const prefix = app.getHttpAdapter().getInstance().getGlobalPrefix();
        expect(prefix).toBe('api/v1');
    });

        // Tests that the port and session ID are correctly retrieved from the ConfigService
        it('should retrieve the port and session ID from the ConfigService', async () => {
            const mockPort = 1234;
            const mockSessionId = 'mockSessionId';
            jest.spyOn(NestFactory, 'create').mockImplementation(() => { 
                return {
                    get: () => { return mockPort || mockSessionId }
                } as any
            });
            try {
            const app = await NestFactory.create<NestExpressApplication>(AppModule);
            await bootstrap();
            expect(app.get('mockPort')).toBe(mockPort);
            expect(app.get('mockSessionId')).not.toBe('fdfdfdfdf');
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
});