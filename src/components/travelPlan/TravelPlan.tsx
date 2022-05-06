import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import CountryIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Flag';
import TagIcon from '@mui/icons-material/Tag';
import EditIcon from '@mui/icons-material/Edit';
import CountriesForm from './CountriesForm';
import PlacesForm from './PlacesForm';
import TagsForm from './TagsForm';

/**
 * TODO - need to import Travel History data from firestore.
 * @returns
 */
function TravelPlan() {
  const user = useAppSelector(getUser);
  const [openCountries, setOpenCountries] = useState(false);
  const [openPlaces, setOpenPlaces] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const handleEditCountries = () => {
    // handleEditCountires form.
    setOpenCountries(true);
  };

  const handleCloseCountries = () => {
    setOpenCountries(false);
  };

  const handleEditPlaces = () => {
    setOpenPlaces(true);
  };

  const handleClosePlaces = () => {
    setOpenPlaces(false);
  };

  const handleEditTags = () => {
    setOpenTags(true);
  };

  const handleCloseTags = () => {
    setOpenTags(false);
  };

  return (
    <Box m={0.5}>
      {!user ? (
        <Box display='flex' justifyContent='center' m={1} p={1}>
          <CircularProgress color='inherit' />
        </Box>
      ) : (
        <>
          <Grid item xs={12}>
            <List sx={{ p: 0, m: 0 }}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='edit-countries-plan'
                    onClick={handleEditCountries}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <CountryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Countries: ${user.countries_plan?.length}`}
                />
              </ListItem>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='edit-sites-plan'
                    onClick={handleEditPlaces}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PlaceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Sites: ${user.places_plan?.length}`} />
              </ListItem>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='edit-tags'
                    onClick={handleEditTags}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <TagIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Tags: ${user.tags?.length}`} />
              </ListItem>
            </List>
          </Grid>
          {openCountries ? (
            <CountriesForm
              open={openCountries}
              handleClose={handleCloseCountries}
            />
          ) : null}
          {openPlaces ? (
            <PlacesForm open={openPlaces} handleClose={handleClosePlaces} />
          ) : null}
          {openTags ? (
            <TagsForm open={openTags} handleClose={handleCloseTags} />
          ) : null}
        </>
      )}
    </Box>
  );
}

export default TravelPlan;
