import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAuction } from '../requests/axios';

interface IAuctionsState {
  attributes: string[];
  auctions: IAuction[];
  items: string[];
  loading: boolean;
}

const initialState: IAuctionsState = { attributes: [], auctions: [], items: [], loading: false };

const auctionsSlice = createSlice({
  initialState,
  name: 'auctions',
  reducers: {
    setAuctions: (state, action: PayloadAction<IAuction[]>) => {
      state.auctions = action.payload;
      state.loading = false;
      action.payload.forEach((auction) => {
        Object.keys(auction.attributes).forEach((attribute) => {
          if (!state.attributes.includes(attribute)) {
            state.attributes.push(attribute);
          }
        });
        if (!state.items.includes(auction.itemName)) {
          state.items.push(auction.itemName);
        }
      });
    },
    startLoading: (state) => {
      state.loading = true;
    }
  }
});

export const { setAuctions, startLoading } = auctionsSlice.actions;

export const auctionsReducer = auctionsSlice.reducer;
