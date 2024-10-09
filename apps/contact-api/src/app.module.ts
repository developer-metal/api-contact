import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config-options';
import { FormProjectModule } from './form-reception/form-project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configConnect } from './config/config-connection';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';
import { SatisfactionSurveyModule } from './satisfaction-survey/satisfaction-survey.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend','dist')
    } as ServeStaticModuleOptions),
    ConfigModule.forRoot(configOptions),
    MongooseModule.forRootAsync(configConnect),
    AuthModule,
    FormProjectModule,
    SatisfactionSurveyModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}