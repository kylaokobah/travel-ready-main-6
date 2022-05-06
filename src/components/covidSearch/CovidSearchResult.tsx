import { Grid, Typography } from '@mui/material';
import { useAppSelector } from 'hooks';
import { getCovidResult } from 'modules/covid';
import React from 'react';
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

interface CovidSearchResultProps {
  isMinimum: boolean;
}

function CovidSearchResult(props: CovidSearchResultProps) {
  const covidResult = useAppSelector(getCovidResult);
  const last = covidResult.length - 1;

  return (
    <>
      <Grid container justifyContent='center' direction='row'>
        {props.isMinimum ? null : (
          <Grid item xs={12}>
            <Typography align='center' variant='h6' gutterBottom>
              Country: {covidResult[last].country}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={props.isMinimum ? 12 : 6}>
          <ResponsiveContainer height={250}>
            <LineChart data={covidResult}>
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='confirmed_daily'
                stroke='#8884d8'
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        {props.isMinimum ? null : (
          <Grid item xs={12} sm={6}>
            <ResponsiveContainer height={250}>
              <LineChart data={covidResult}>
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='deaths_daily' stroke='#82ca9d' />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        )}

        <Grid item xs={12} sm={props.isMinimum ? 12 : 4}>
          <Typography align='center' variant='body1'>
            Total Confirmed: {covidResult[last].confirmed}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={props.isMinimum ? 12 : 4}>
          <Typography align='center' variant='body1'>
            Total Deaths: {covidResult[last].deaths}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={props.isMinimum ? 12 : 4}>
          <Typography align='center' variant='body1'>
            Total Comfirmed / Population:{' '}
            {covidResult[last].population > 0
              ? (
                  (covidResult[last].confirmed / covidResult[last].population) *
                  100
                ).toFixed(2)
              : ''}
            %
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default CovidSearchResult;
