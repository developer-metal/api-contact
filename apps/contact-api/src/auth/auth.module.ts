import { HttpModule } from '@nestjs/axios';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/config-jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { CsrfController } from './controllers/csrf.controller';
import { CsrfMiddleware } from './middleware/csrf.middleware';
import { FormProjectController } from '../form-reception/controllers/form-project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { tokensProviders } from './model/token.providers';
import { SatisfactionSurveyController } from '../satisfaction-survey/controllers/satisfaction-survey.controller';
@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeatureAsync([tokensProviders]),
    JwtModule.register({
      global: false,
      secret: jwtConstants.secret
    }),
    PassportModule,
    ConfigModule
  ],
  controllers: [AuthController, CsrfController],
  providers: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).exclude({
      path: '/form-general/mailing/:id', method: RequestMethod.GET
    }).forRoutes('*');
    consumer.apply(CsrfMiddleware).exclude({
      path: '/form-general/mailing/:id', method: RequestMethod.GET
    })
      .forRoutes(
        { path: 'form-general', method: RequestMethod.ALL },
        { path: 'form-general', method: RequestMethod.DELETE },
        'form-general/:idform');
    consumer
        .apply(CsrfMiddleware)
        .exclude({
          path: '/form-general/mailing/:id', method: RequestMethod.GET
        })
        .forRoutes(FormProjectController);
        consumer.apply(CsrfMiddleware, AuthMiddleware).forRoutes(SatisfactionSurveyController);
  }
}
