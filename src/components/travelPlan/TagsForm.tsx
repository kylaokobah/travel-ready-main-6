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
import { addUserTag, deleteUserTag, getUserFromDB } from 'db/repositories/user';
import { setBackdrop } from 'modules/backdrop';
import { isFound } from 'lib';

interface TagsFormProps {
  open: boolean;
  handleClose: () => void;
}

function TagsForm(props: TagsFormProps) {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser;
  const [value, setValue] = useState('');

  const handleAdd = async () => {
    if (user?.tags) {
      if (isFound(value, user.tags)) {
        alert('You already add the selected site.');
      } else {
        dispatch(setBackdrop(true));
        if (currentUser) {
          await addUserTag(currentUser.uid, value);

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
    if (user?.tags) {
      if (!isFound(value, user.tags)) {
        alert(
          'Failed to delete selected tag, because the tag is not on your list.'
        );
      } else {
        dispatch(setBackdrop(true));
        if (currentUser) {
          await deleteUserTag(currentUser.uid, value);

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
      <DialogTitle sx={{ textAlign: 'center' }}>Travel Plan - Tags</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Title>Search Tags to Add</Title>
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
            <Title> Tags List </Title>

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
                {user?.tags && user.tags.length > 0 ? (
                  user.tags.map((place, i) => (
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
                    Please add a tag to display list.
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

export default TagsForm;
