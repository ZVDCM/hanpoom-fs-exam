import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { SnakeCaseInterceptor } from 'src/snake-case.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());

    app.use(cookieParser());

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalInterceptors(new SnakeCaseInterceptor());

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
