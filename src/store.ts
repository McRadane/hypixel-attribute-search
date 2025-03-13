import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { Logger } from './logger';
import { auctionsReducer } from './services/auctions';

const middlewares: Middleware[] = [];

// eslint-disable-next-line sonarjs/no-reference-error
if (process?.env?.NODE_ENV === `development`) {
  const logger = createLogger({
    // ...options
  });

  middlewares.push(logger);
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
  reducer: {
    auctions: auctionsReducer
  }
});

Logger.log('Creating the store', store);

export type RootState = ReturnType<typeof store.getState>;
