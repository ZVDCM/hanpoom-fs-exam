import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { SnakeCaseInterceptor } from 'src/snake-case.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalInterceptors(new SnakeCaseInterceptor());

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
