import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Case from 'case';

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map((data) => this.convertKeysToSnakeCase(data)));
    }

    private convertKeysToSnakeCase(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertKeysToSnakeCase(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce(
                (acc, key) => {
                    const snakeKey = Case.snake(key);
                    acc[snakeKey] = this.convertKeysToSnakeCase(obj[key]);
                    return acc;
                },
                {} as Record<string, any>,
            );
        }
        return obj;
    }
}
