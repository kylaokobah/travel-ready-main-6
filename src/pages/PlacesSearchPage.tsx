import React from 'react';
import { Box, Toolbar } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';
import PlacesSearch from 'components/placesSearch/PlacesSearch';

function PlacesSearchPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.PLACES_BY_INTEREST_SEARCH} />
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <PlacesSearch />
      </Box>
    </Box>
  );
}

export default PlacesSearchPage;
