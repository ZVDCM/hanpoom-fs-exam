export const checkForErrors = (results: PromiseSettledResult<unknown>[]) => {
    const errors = results
        .filter((r) => r.status === 'rejected')
        .map((r) => (r as PromiseRejectedResult).reason);

    if (errors.length > 0) {
        throw new Error(`Some imports failed: ${errors.join(', ')}`);
    }
};
