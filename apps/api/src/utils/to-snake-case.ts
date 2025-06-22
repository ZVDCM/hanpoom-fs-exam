import Case from 'case';

export const toSnakeCase = (obj: unknown) => {
    if (Array.isArray(obj)) {
        return obj.map((item) => toSnakeCase(item));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce(
            (acc, key) => {
                const snakeKey = Case.snake(key);
                acc[snakeKey] = toSnakeCase(obj[key]);
                return acc;
            },
            {} as Record<string, any>,
        );
    }
    return obj;
};
