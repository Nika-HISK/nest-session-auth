import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PgSession = pgSession(session);

  app.use(
    session({
      store: new PgSession({
        conObject: {
          connectionString: 'postgres://postgres:postgres@localhost:5432/session_auth_db',
        },
        tableName: 'session',
      }),
      secret: 'supersecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
