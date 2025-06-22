import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { SnakeCaseInterceptor } from 'src/snake-case.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Hanpoom FS Exam')
        .setDescription('Picking Slips and Authentication')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app.use(helmet());

    app.use(cookieParser());

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useGlobalInterceptors(new SnakeCaseInterceptor());

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
