import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getAuthUserByContext = (context: ExecutionContext) =>
    context.switchToHttp().getRequest().user;

export const AuthUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
    getAuthUserByContext(context),
);
