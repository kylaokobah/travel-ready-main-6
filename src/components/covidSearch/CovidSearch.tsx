import { useAppDispatch, useAppSelector } from 'hooks';
import { getCountries, setCountryList } from 'modules/country';
import React, { useEffect, useState } from 'react';
import * as country from 'db/repositories/country';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'api/client';
import Title from 'components/title/Title';
import { getCovidResult, setCovidResult } from 'modules/covid';
import { CovidResultData } from 'types';
import CovidSearchResult from './CovidSearchResult';

function CovidSearch() {
  const countries = useAppSelector(getCountries);
  const covidResult = useAppSelector(getCovidResult);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState('');
  const [backdrop, setBackdrop] = useState(false);

  useEffect(() => {
    if (!countries?.length) {
      fetchCountries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  const fetchCountries = async () => {
    const _countries = await country.getAllCountries();
    if (_countries) {
      dispatch(setCountryList(_countries));
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  const getSearchResult = () => {
    const max_date = new Date();
    const min_date = new Date(new Date().setDate(new Date().getDate() - 8));
    setBackdrop(true);
    axios
      .get(
        `https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/countries_summary?country_iso3=${selected}&min_date=${min_date.toISOString()}&max_date=${max_date.toISOString()}`
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
        setBackdrop(false);
      });
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
              Search by Country
            </Typography>
          </Box>
          <FormControl sx={{ mt: 1, mb: 1 }} fullWidth>
            <Select id='search-by-country' value={selected} onChange={handleChange}>
              {countries?.map((c) => (
                <MenuItem key={c.code} value={c.code3}>
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
          <Button
            variant='contained'
            onClick={getSearchResult}
            disabled={!selected}
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
            <Title>COVID-19 Condition</Title>
            <Box display='flex' justifyContent='center' m={2}>
              {backdrop ? (
                <CircularProgress color='inherit' />
              ) : selected ? (
                covidResult.length <= 0 ? (
                  <Typography variant='guideline' align='center'>
                    Selected countries does not have COVID-19 data.
                  </Typography>
                ) : (
                  <CovidSearchResult isMinimum={false} />
                )
              ) : (
                <Typography variant='guideline' align='center'>
                  Please select a country to show result!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CovidSearch;
