export const getValues = (results: PromiseSettledResult<unknown>[]) =>
    results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value);
