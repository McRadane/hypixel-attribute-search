import React, { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';

import { IAuction } from '../requests/axios';

import { Item } from './Item';
import { CARD_HEIGHT, CARD_WIDTH } from './sizes';

import './GridItems.css';

const Cell: FC<{
  columnIndex: number;
  data: { columnCount: number; items: IAuction[] };
  rowIndex: number;
  style: React.CSSProperties;
}> = ({ columnIndex, data, rowIndex, style }) => {
  const { columnCount, items } = data;
  const singleColumnIndex = columnIndex + rowIndex * columnCount;
  const card = items[singleColumnIndex];
  return (
    <div style={style}>
      {card && (
        <div
          style={{
            display: 'inline-block',
            height: CARD_HEIGHT,
            width: CARD_WIDTH
          }}
          key={card.uuid}
        >
          <Item auction={card} />
        </div>
      )}
    </div>
  );
};

export const GridItems: FC<{ items: IAuction[] }> = ({ items }) => (
  <div
    style={{
      backgroundColor: '#d6cae2',
      marginTop: '2em',
      minHeight: '100vh',
      position: 'sticky',
      top: '0px'
    }}
  >
    <AutoSizer>
      {({ height, width }) => {
        const cardWidth = CARD_WIDTH;
        const cardHeight = CARD_HEIGHT;
        const columnCount = Math.floor(width / cardWidth);
        const rowCount = Math.ceil(items.length / columnCount);
        return (
          <Grid
            columnWidth={cardWidth}
            width={width}
            className="grid"
            columnCount={columnCount}
            height={height}
            itemData={{ columnCount, items }}
            rowCount={rowCount}
            rowHeight={cardHeight}
          >
            {Cell}
          </Grid>
        );
      }}
    </AutoSizer>
  </div>
);
