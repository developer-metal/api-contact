import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import { join } from 'path';
export const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: {
    origin: ['https://explora-cdn.tbkapoyandonegocios.cl'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS','PATCH','HEAD'],
    credentials: true
  }});
  const configSetup = app.get(ConfigService);
  const port: number = configSetup.get('port');
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false, transform: true }));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.setGlobalPrefix('api/v1');
  app.use(bodyParser.urlencoded({ extended: false }));
  const options = new DocumentBuilder()
    .setTitle('Contact API')
    .setDescription('Hermes contact Api')
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'authorization'
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  document.servers = [{url: 'http://localhost:3500', description: 'Servidor local' }]
  document.externalDocs = { url: 'http://localhost:3500/contact-api/docs-json', description: 'Documentación API formato json'};
  fs.writeFileSync(join(__dirname, '..',"./doc/swagger/api-contact.json"), JSON.stringify(document)); 
  fs.writeFileSync(join(__dirname, '..',"./doc/swagger/api-contact.yaml"), JSON.stringify(document));
  SwaggerModule.setup('/contact-api/docs', app, document, { customCss: '.swagger-ui .topbar { display: none }'});
  await app.listen(port);
};
bootstrap();