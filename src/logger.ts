export const Logger = {
  log: (...args: unknown[]) => {
    // eslint-disable-next-line sonarjs/no-reference-error
    if (process?.env?.NODE_ENV === `development`) {
      console.log(...args);
    }
  }
};
