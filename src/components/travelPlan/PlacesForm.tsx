import React, { useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Title from 'components/title/Title';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import { auth } from 'db';
import {
  addUserPlace,
  deleteUserPlace,
  getUserFromDB,
} from 'db/repositories/user';
import { setBackdrop } from 'modules/backdrop';
import { isFound } from 'lib';

interface PlacesFormProps {
  open: boolean;
  handleClose: () => void;
}

function PlacesForm(props: PlacesFormProps) {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser;
  const [value, setValue] = useState('');

  const handleAdd = async () => {
    if (user?.places_plan) {
      if (isFound(value, user.places_plan)) {
        alert('You already add the selected site.');
      } else {
        dispatch(setBackdrop(true));
        if (currentUser) {
          await addUserPlace(currentUser.uid, value);

          dispatch(setUser(await getUserFromDB(currentUser.uid)));

          setValue('');
          dispatch(setBackdrop(false));
        }
      }
    } else {
      alert('User is logged out. Please log in again to continue.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleDelete = async (value: string) => {
    if (user?.places_plan) {
      if (!isFound(value, user.places_plan)) {
        alert(
          'Failed to delete selected site, because the site is not on your list.'
        );
      } else {
        dispatch(setBackdrop(true));
        if (currentUser) {
          await deleteUserPlace(currentUser.uid, value);

          dispatch(setUser(await getUserFromDB(currentUser.uid)));

          dispatch(setBackdrop(false));
        }
      }
    } else {
      alert('User is logged out. Please log in again to continue.');
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Travel Plan - Sites
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Title>Search Sites to Add</Title>
            <TextField
              margin='dense'
              id='sites'
              fullWidth
              variant='outlined'
              onChange={handleChange}
              size='small'
              value={value}
            />
            <Button
              variant='contained'
              onClick={handleAdd}
              fullWidth
              disabled={!value}
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Title> Sites List </Title>

            <Paper variant='outlined'>
              <Paper
                component='ul'
                elevation={0}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  margin: 1,
                  padding: 0,
                }}
              >
                {user?.places_plan && user.places_plan.length > 0 ? (
                  user.places_plan.map((place, i) => (
                    <li key={i}>
                      <Chip
                        label={place}
                        sx={{ margin: 0.5 }}
                        onDelete={() => {
                          handleDelete(place);
                        }}
                        color='primary'
                      />
                    </li>
                  ))
                ) : (
                  <Typography variant='guideline' align='center'>
                    Please add a site to display list.
                  </Typography>
                )}
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant='contained'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlacesForm;
