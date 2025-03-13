import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GridItems } from './components/GridItems';
import { MultiSelect } from './components/MultiSelect';
import { RangeSlider } from './components/RangeSlider';
import { Select } from './components/Select';
import { ToggleButtons } from './components/ToggleButtons';
import { Logger } from './logger';
import { attributes } from './models/attributes';
import { auctionTypes } from './models/auctionsTypes';
import { items } from './models/items';
import { rawAuctionToAuction } from './requests/axios';
import { Database } from './requests/database';
import { setAuctions, startLoading } from './services/auctions';
import type { RootState } from './store';

export const App = () => {
  const dispatch = useDispatch();

  const auctionsRequest = useRef(false);
  const { auctions, loading } = useSelector((state: RootState) => state.auctions);

  const [filterItem, setFilterItem] = useState<string>();
  const [filterAttribute, setFilterAttribute] = useState<string[]>();
  const [filterLevels, setFilterLevels] = useState<[number, number]>([1, 10]);
  const [filterType, setFilterType] = useState('');

  const handleFilterLevelsChange = (newValue: number | number[]) => {
    const newNumbers = newValue as [number, number];

    setFilterLevels([newNumbers[0], newNumbers[1]]);
  };

  const filteredAuctions = useMemo(() => {
    let filtered = [...auctions];

    if (filterItem) {
      filtered = filtered.filter((auction) => auction.itemName === filterItem);
    }

    if (filterAttribute) {
      filterAttribute.forEach((attribute) => {
        filtered = filtered.filter((auction) => auction.attributes[attribute]);
        if (filterLevels[0] !== 1 || filterLevels[1] !== 10) {
          filtered = filtered.filter(
            (auction) => auction.attributes[attribute] >= filterLevels[0] && auction.attributes[attribute] <= filterLevels[1]
          );
        }
      });
    }

    if (filterType) {
      filtered = filtered.filter((auction) => auction.bin === (filterType === 'BIN'));
    }

    return filtered.sort((a, b) => a.startingBid - b.startingBid);
  }, [auctions, filterItem, filterAttribute, filterType, filterLevels]);

  useEffect(() => {
    if (!auctionsRequest.current) {
      auctionsRequest.current = true;
      const database = new Database();
      database.cacheDuration = 1000 * 60 * 10;
      dispatch(startLoading());

      database
        .getAuctions()
        .then((data) => {
          const auctions = data.map((auction) => rawAuctionToAuction(auction));

          dispatch(setAuctions(auctions));
        })
        .catch((error) => {
          Logger.log('Error getting auctions', error);
        });
    }
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', paddingTop: '64px' }}>
      <AppBar component="nav">
        <Toolbar>
          <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
            Auction Attribute Search
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ width: '100%' }}>
        <Box sx={{ height: 8 }}>{loading && <LinearProgress />}</Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(4, auto)',
            padding: 1
          }}
        >
          <Select label="Items" onChange={setFilterItem} values={items} />
          <MultiSelect label="Attributes" maxItems={2} onChange={setFilterAttribute} values={attributes} />

          <RangeSlider label="Levels" max={10} min={1} onChange={handleFilterLevelsChange} />
          <ToggleButtons label="Auction Type" onChange={setFilterType} options={auctionTypes} />
        </Box>
        {/*<Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            gap: 2,
          }}
        >*/}
        <GridItems items={filteredAuctions} />
      </Box>
    </Box>
  );
};
