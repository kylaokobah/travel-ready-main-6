import React, { useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import Title from 'components/title/Title';
import Copyright from 'components/copyright/Copyright';
import TravelHistory from 'components/travelHistory/TravelHistory';
import TravelGoal from 'components/travelGoal/TravelGoal';
import TravelPlan from 'components/travelPlan/TravelPlan';

function Dashboard() {
  const [openTravelHistoryAddForm, setOpenTravelHistoryAddForm] =
    useState(false);

  const handleOpenTravelHistoryForm = () => {
    setOpenTravelHistoryAddForm(true);
  };

  const handleCloseHistoryAddForm = () => {
    setOpenTravelHistoryAddForm(false);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Grid container direction='row' spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 250,
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Travel Goal</Title>
            <TravelGoal />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 250,
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Travel Plan</Title>
            <TravelPlan />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Title buttonFunction={handleOpenTravelHistoryForm}>
              Travel History
            </Title>
            <TravelHistory
              open={openTravelHistoryAddForm}
              handleClose={handleCloseHistoryAddForm}
              isPersonalOnly={true}
            />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Dashboard;
