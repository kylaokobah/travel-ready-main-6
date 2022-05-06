import React from 'react';
import { Typography, Box, Button } from '@mui/material';

interface TitleProps {
  children?: React.ReactNode;
  buttonFunction?: () => void;
  buttonName?: string;
}

function Title(props: TitleProps) {
  return (
    <Box display='flex' justifyContent='space-between'>
      <Typography component='h2' variant='h6' gutterBottom>
        {props.children}
      </Typography>
      {props.buttonFunction ? (
        <Button onClick={props.buttonFunction} variant='contained'>
          {props.buttonName ? props.buttonName : 'NEW'}
        </Button>
      ) : null}
    </Box>
  );
}

export default Title;
