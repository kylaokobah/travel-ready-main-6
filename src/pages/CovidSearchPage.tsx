import React from 'react';
import { Box, Toolbar } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';
import CovidSearch from 'components/covidSearch/CovidSearch';

function CovidSearchPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.COVID_19_CONDITION_SEARCH} />
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
        <CovidSearch />
      </Box>
    </Box>
  );
}

export default CovidSearchPage;
