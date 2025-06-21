import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
