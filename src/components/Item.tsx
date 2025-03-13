import CheckIcon from '@mui/icons-material/Check';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Chip, List, ListItem, ListItemText, Typography } from '@mui/material';
import { FC, useCallback, useState } from 'react';

import { IAuction } from '../requests/axios';

import { CARD_HEIGHT, CARD_WIDTH } from './sizes';

export const Item: FC<{ auction: IAuction }> = ({ auction }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`/viewauction ${auction.uuid}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [auction.uuid]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: `calc(${CARD_HEIGHT}px - 5px)`, width: `calc(${CARD_WIDTH}px - 5px)` }}>
      <CardHeader
        title={
          <>
            {auction.itemName} <Chip label={auction.bin ? 'BIN' : 'Auction'} />
          </>
        }
      />

      <CardContent sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <Typography component="div" variant="h6" gutterBottom>
          {auction.rawItemName}
        </Typography>
        <Typography component="div" sx={{ color: 'text.secondary', flex: 1 }} variant="body2">
          <List>
            {Object.entries(auction.attributes).map(([key, value]) => (
              <ListItem key={key} secondaryAction={value}>
                <ListItemText primary={key} />
              </ListItem>
            ))}
          </List>
        </Typography>
        <Typography component="div" variant="h6" gutterBottom>
          Price : {Math.ceil(auction.startingBid).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleCopy} size="small">
          Copy to clipboard
        </Button>
      </CardActions>
      {copied && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Copied to clipboard!
        </Alert>
      )}
    </Card>
  );
};
// /viewauction ce049a54341944629cb52a64d8dcee14
