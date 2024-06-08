import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { SwaggerModule } from '@nestjs/swagger';
import { options } from './utils';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(bodyParser.json());
  app.use(cookieParser(config.Secret));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  await app.listen(config.port.HTTP_PORT, () => {
    console.log(`app running on port ${config.port.HTTP_PORT}`);
  });
}
bootstrap();
