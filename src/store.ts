import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { Logger } from './logger';
import { auctionsReducer } from './services/auctions';

const middlewares: Middleware[] = [];

if (import.meta.env.DEV) {
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
