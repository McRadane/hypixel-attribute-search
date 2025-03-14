import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GridItems } from './components/GridItems';
import { RangeSlider } from './components/RangeSlider';
import { Select } from './components/Select';
import { Logger } from './logger';
import { rawAuctionToAuction } from './requests/axios';
import { Database } from './requests/database';
import { setAuctions, startLoading } from './services/auctions';
import type { RootState } from './store';

export const App = () => {
  const dispatch = useDispatch();

  const auctionsRequest = useRef(false);
  const { attributes, auctions, items, loading } = useSelector((state: RootState) => state.auctions);

  const [filterItem, setFilterItem] = useState<string>();
  const [filterAttribute, setFilterAttribute] = useState<string>();
  const [filterLevels, setFilterLevels] = useState<[number, number]>([1, 10]);

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
      filtered = filtered.filter((auction) => auction.attributes[filterAttribute]);
      if (filterLevels[0] !== 1 || filterLevels[1] !== 10) {
        filtered = filtered.filter(
          (auction) => auction.attributes[filterAttribute] >= filterLevels[0] && auction.attributes[filterAttribute] <= filterLevels[1]
        );
      }
    }

    return filtered.sort((a, b) => a.startingBid - b.startingBid);
  }, [auctions, filterItem, filterAttribute, filterLevels]);

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
            display: 'grid',
            gap: 1,
            // justifyContent: "space-between",
            gridTemplateColumns: 'auto auto auto',
            padding: 1
          }}
        >
          <Select label="Items" onChange={setFilterItem} values={items} allowEmpty />
          <Select label="Attributes" onChange={setFilterAttribute} values={attributes} allowEmpty />

          <RangeSlider label="Levels" max={10} min={1} onChange={handleFilterLevelsChange} />
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
