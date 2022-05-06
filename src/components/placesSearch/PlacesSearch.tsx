import { useAppDispatch } from 'hooks';
import React, { useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  TextField,
} from '@mui/material';
import Title from 'components/title/Title';
import { setPlacesSearchResult } from 'modules/placesSearch';
import { getListTravelHistoryByTag } from 'db/repositories/travelHistory';
import TravelHistory from 'components/travelHistory/TravelHistory';

function PlacesSearch() {
  const dispatch = useAppDispatch();
  const [tag, setTag] = useState('');
  const [backdrop, setBackdrop] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };

  const getSearchResult = async () => {
    setBackdrop(true);
    const result = await getListTravelHistoryByTag(tag);
    dispatch(setPlacesSearchResult(result));
    if (isInitial) {
      setIsInitial(false);
    }
    setBackdrop(false);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      padding={2}
    >
      <Grid container alignItems='center' justifyContent='center' spacing={2}>
        <Grid item xs={12} md={5}>
          <Box>
            <Typography variant='h4' align='center'>
              Places Search by Interset
            </Typography>
          </Box>
          <TextField
            sx={{ mt: 1, mb: 1 }}
            id='tag'
            fullWidth
            variant='outlined'
            placeholder='Search places by tag'
            onChange={handleChange}
            value={tag}
          />
          <Button
            variant='contained'
            onClick={getSearchResult}
            disabled={!tag}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Places Search Results</Title>
            <Box display='flex' justifyContent='center' m={2}>
              {backdrop ? (
                <CircularProgress color='inherit' />
              ) : !isInitial ? (
                <TravelHistory
                  open={false}
                  handleClose={() => {}}
                  isPersonalOnly={false}
                />
              ) : (
                <Typography variant='guideline' align='center'>
                  Click search button to find places for you!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PlacesSearch;
