import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Title from 'components/title/Title';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getCountries } from 'modules/country';
import { getUser, setUser } from 'modules/user';
import { auth } from 'db';
import {
  addUserCountry,
  deleteUserCountry,
  getUserFromDB,
} from 'db/repositories/user';
import { setBackdrop } from 'modules/backdrop';

interface CountriesFormProps {
  open: boolean;
  handleClose: () => void;
}

function CountriesForm(props: CountriesFormProps) {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser;
  const countries = useAppSelector(getCountries);
  const [selected, setSelected] = useState('');

  const handleAdd = async () => {
    if (user?.countries_plan.indexOf(selected) !== -1) {
      alert('You already add the selected country.');
    } else {
      dispatch(setBackdrop(true));
      if (currentUser) {
        await addUserCountry(currentUser.uid, selected);

        dispatch(setUser(await getUserFromDB(currentUser.uid)));

        dispatch(setBackdrop(false));
      }
    }
  };

  const handleDelete = async (value: string) => {
    if (user?.countries_plan.indexOf(value) === -1) {
      alert(
        'Failed to delete selected country, because the country is not on your list.'
      );
    } else {
      dispatch(setBackdrop(true));
      if (currentUser) {
        await deleteUserCountry(currentUser.uid, value);

        dispatch(setUser(await getUserFromDB(currentUser.uid)));

        dispatch(setBackdrop(false));
      }
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center ' }}>
        Travel Plan - Countries
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Title>Search Country to Add</Title>
            <FormControl sx={{ mt: 1, mb: 1 }} fullWidth>
              <Select
                id='countries-to-add'
                value={selected}
                onChange={handleChange}
                size='small'
              >
                {countries?.map((c) => (
                  <MenuItem key={c.code} value={c.name}>
                    <img
                      loading='lazy'
                      width='20'
                      src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                      alt={`Flag of ${c.name}`}
                      style={{ paddingRight: '2px' }}
                    />
                    {c.name} ({c.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant='contained' onClick={handleAdd} fullWidth>
              Add
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Title> Countries List </Title>

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
                {user?.countries_plan && user.countries_plan.length > 0 ? (
                  user.countries_plan.map((country, i) => (
                    <li key={i}>
                      <Chip
                        label={country}
                        sx={{ margin: 0.5 }}
                        onDelete={() => {
                          handleDelete(country);
                        }}
                        color='primary'
                      />
                    </li>
                  ))
                ) : (
                  <Typography variant='guideline' align='center'>
                    Please add a country to display list.
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

export default CountriesForm;
