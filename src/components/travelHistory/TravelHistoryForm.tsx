import {
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Paper,
  Chip,
  DialogActions,
  CardMedia,
  Card,
  Box,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Rating,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import { auth } from 'db';
import { setBackdrop } from 'modules/backdrop';
import {
  CovidResultData,
  TravelHistoryAddFormData,
  TravelHistoryData,
} from 'types';
import Title from 'components/title/Title';
import {
  getSingleTravelHistory,
  setTravelHistory,
  updateTravelHistory,
} from 'db/repositories/travelHistory';
import { getCountries } from 'modules/country';
import { findCountryByName, isFound } from 'lib';
import { getUserFromDB } from 'db/repositories/user';
import {
  getTravelHistoryList,
  setTravelHistoryList,
} from 'modules/travelHistory';
import axios from 'axios';
import { getCovidResult, setCovidResult } from 'modules/covid';
import CovidSearchResult from 'components/covidSearch/CovidSearchResult';

interface TravelHistoryAddFormProps {
  open: boolean;
  handleClose: () => void;
  isUpdate: boolean;
  isDetail: boolean;
  travelHistory: TravelHistoryData | null;
}

function TravelHistoryForm(props: TravelHistoryAddFormProps) {
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const travelHistories = useAppSelector(getTravelHistoryList);
  const covidResult = useAppSelector(getCovidResult);
  const countries = useAppSelector(getCountries);
  const dispatch = useAppDispatch();
  const [covidBackdrop, setCovidBackdrop] = useState(false);
  const [values, setValues] = useState<TravelHistoryAddFormData>({
    id: '',
    uid: '',
    photoURL: '',
    country: '',
    site: '',
    description: '',
    tags: [],
    tag: '',
    imageURL: '',
    imageFile: null,
    rating: 0,
  });

  useEffect(() => {
    if (user) {
      setValues({
        id: `${currentUser?.uid}_${user.travel_histories.length + 1}`,
        uid: `${currentUser?.uid}`,
        photoURL: user.photoURL,
        country:
          props.isUpdate && props.travelHistory
            ? props.travelHistory.country
            : '',
        site:
          props.isUpdate && props.travelHistory ? props.travelHistory.site : '',
        description:
          props.isUpdate && props.travelHistory
            ? props.travelHistory.description
            : '',
        tags:
          props.isUpdate && props.travelHistory ? props.travelHistory.tags : [],
        tag: '',
        imageURL:
          props.isUpdate && props.travelHistory
            ? props.travelHistory.image
            : '',
        imageFile: null,
        rating:
          props.isUpdate && props.travelHistory
            ? props.travelHistory.rating
            : 5,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (props.isDetail && values.country) {
      getSearchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isDetail, values.country]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    let file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          setValues({
            ...values,
            imageFile: file,
            imageURL: `${reader.result}`,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setValues({ ...values, imageFile: null, imageURL: '' });
    }
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleAddTag = () => {
    if (isFound(values.tag, values.tags)) {
      alert('You cannot add same tag twice.');
    } else {
      const newTags = [...values.tags];
      newTags.push(values.tag.toLowerCase());
      setValues({ ...values, tag: '', tags: newTags });
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (!isFound(tag, values.tags)) {
      alert('You cannot delete a tag that is not in your list.');
    } else {
      const newTags = values.tags.filter((value) => value !== tag);
      setValues({ ...values, tags: newTags });
    }
  };

  const handleSubmit = async () => {
    if (
      values.imageFile &&
      values.id &&
      values.uid &&
      values.photoURL &&
      values.country &&
      values.site
    ) {
      dispatch(setBackdrop(true));
      await setTravelHistory(values);
      dispatch(setUser(await getUserFromDB(values.uid)));
      // add travel history in the beginning, remove last one.
      // let newList = await getListTravelHistory([values.id]);
      let newPost = await getSingleTravelHistory(values.id);
      let newList = newPost
        ? [newPost].concat([...travelHistories])
        : [...travelHistories];
      if (newList.length > 2 && newList.length % 3 === 1) {
        newList.pop();
      }
      dispatch(setTravelHistoryList(newList));
      dispatch(setBackdrop(false));
      props.handleClose();
    } else {
      alert('Please add all required fields first.');
    }
  };

  const handleUpdate = async () => {
    if (props.travelHistory?.id) {
      dispatch(setBackdrop(true));
      await updateTravelHistory(props.travelHistory.id, values);

      let newPost = await getSingleTravelHistory(props.travelHistory.id);
      let index = travelHistories
        .map((obj) => obj.id)
        .indexOf(props.travelHistory.id);

      if (index !== -1 && newPost) {
        let newList = [...travelHistories];
        newList[index] = newPost;
        dispatch(setTravelHistoryList(newList));
      }
      dispatch(setBackdrop(false));
      props.handleClose();
    } else {
      alert('Selected Travel history does not exist.');
      props.handleClose();
    }
  };

  const getSearchResult = () => {
    const max_date = new Date();
    const min_date = new Date(new Date().setDate(new Date().getDate() - 8));
    const country = findCountryByName(values.country, countries);
    if (country) {
      setCovidBackdrop(true);
      axios
        .get(
          `https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/countries_summary?country_iso3=${
            country?.code3
          }&min_date=${min_date.toISOString()}&max_date=${max_date.toISOString()}`
        )
        .then((res: any) => {
          const data: CovidResultData[] = [];

          res.data?.forEach((_data: any) => {
            const result: CovidResultData = {
              country: _data.country,
              confirmed: _data.confirmed,
              confirmed_daily: _data.confirmed_daily,
              date: new Date(_data.date).toISOString().split('T')[0],
              deaths: _data.deaths,
              deaths_daily: _data.deaths_daily,
              population: _data.population,
            };
            data.push(result);
          });

          dispatch(setCovidResult(data));
        })
        .finally(() => {
          setCovidBackdrop(false);
        });
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Travel History Add Form
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between'>
              <Typography component='h2' variant='h6' gutterBottom>
                Image
              </Typography>
              {props.isUpdate ? null : (
                <Button variant='contained' component='label'>
                  Upload
                  <input
                    type='file'
                    accept='image/x-png,image/jpeg'
                    hidden
                    onChange={(e) => {
                      onImageChange(e);
                    }}
                  />
                </Button>
              )}
            </Box>
            <Card sx={{ marginTop: 1 }}>
              {values.imageURL ? (
                <CardMedia
                  component='img'
                  height='194'
                  image={values.imageURL}
                  alt='image preview'
                />
              ) : (
                <Box sx={{ height: 194 }}></Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Title>Country</Title>
            <FormControl sx={{ mt: 1, mb: 1 }} fullWidth>
              <Select
                id='countries-to-add'
                value={values.country}
                name='country'
                onChange={handleChangeSelect}
                size='small'
                disabled={props.isUpdate || props.isDetail}
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
          </Grid>

          {props.isDetail ? (
            <Grid item xs={12}>
              <Title>COVID-19 Condition in this Country</Title>
              <Box display='flex' justifyContent='center' m={2}>
                {covidBackdrop ? (
                  <CircularProgress color='inherit' />
                ) : covidResult.length <= 0 ? (
                  <Typography variant='guideline' align='center'>
                    There are no recent COVID-19 data on this country.
                  </Typography>
                ) : (
                  <CovidSearchResult isMinimum={true} />
                )}
              </Box>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Title>Sites</Title>
            <TextField
              margin='dense'
              id='site'
              name='site'
              fullWidth
              variant='outlined'
              onChange={handleChangeText}
              size='small'
              value={values.site}
              disabled={props.isUpdate || props.isDetail}
            />
          </Grid>

          <Grid item xs={12}>
            <Title>Tags</Title>
            {props.isDetail ? null : (
              <>
                <TextField
                  margin='dense'
                  id='tag'
                  name='tag'
                  fullWidth
                  variant='outlined'
                  onChange={handleChangeText}
                  size='small'
                  value={values.tag}
                />
                <Button
                  variant='contained'
                  onClick={handleAddTag}
                  fullWidth
                  disabled={!values.tag}
                  component='label'
                >
                  Add
                </Button>
              </>
            )}

            <Paper variant='outlined' sx={{ marginTop: 0.5 }}>
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
                {values.tags.length > 0 ? (
                  values.tags.map((tag, i) => (
                    <li key={i}>
                      {props.isDetail ? (
                        <Chip
                          label={tag}
                          sx={{ margin: 0.5 }}
                          color='primary'
                        />
                      ) : (
                        <Chip
                          label={tag}
                          sx={{ margin: 0.5 }}
                          onDelete={() => {
                            handleDeleteTag(tag);
                          }}
                          color='primary'
                        />
                      )}
                    </li>
                  ))
                ) : props.isDetail ? (
                  <Typography variant='guideline' align='center'>
                    There is no tag on this site.
                  </Typography>
                ) : (
                  <Typography variant='guideline' align='center'>
                    Please add a tag to display list.
                  </Typography>
                )}
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Title>Review</Title>
            <Rating
              name='rating'
              size='large'
              value={values.rating}
              disabled={props.isDetail}
              onChange={(event, newValue) => {
                setValues({ ...values, rating: newValue ? newValue : 1 });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Title>Description</Title>
            <TextField
              margin='dense'
              id='description'
              name='description'
              fullWidth
              multiline
              maxRows={5}
              value={values.description}
              variant='outlined'
              onChange={handleChangeText}
              size='small'
              disabled={props.isDetail}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {props.isDetail ? null : (
          <Button
            onClick={props.isUpdate ? handleUpdate : handleSubmit}
            variant='contained'
          >
            Save
          </Button>
        )}

        <Button onClick={props.handleClose} variant='contained'>
          {props.isDetail ? 'Close' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TravelHistoryForm;
