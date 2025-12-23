import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Проверьте структуру объекта пользователя
    console.log('Request user:', request.user);
    console.log('Request user uuid:', request.user?.uuid);
    
    // Возможно пользователь хранится в другом поле
    return request.user || null;
  },
);