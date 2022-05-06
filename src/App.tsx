import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Backdrop, CircularProgress, CssBaseline } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthChange } from 'db/repositories/auth';
import LandingPage from 'pages/LandingPage';
import DashboardPage from 'pages/DashboardPage';
import CovidSearchPage from 'pages/CovidSearchPage';
import PlacesSearchPage from 'pages/PlacesSearchPage';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setUser } from 'modules/user';
import { getLoggedInUser } from 'db/repositories/user';
import { getBackdrop } from 'modules/backdrop';
import {LoginForm} from "./components/authentication/LoginForm";
import {RegisterForm} from "./components/authentication/Register";
import {PasswordReset} from "./components/authentication/PasswordReset";
import {PrivateRoute} from "./components/authentication/ProtectedRoute"

function App() {
  const dispatch = useAppDispatch();
  const backdrop = useAppSelector(getBackdrop);
  const theme = createTheme({

                            palette: {

                            primary: {

                            main: '#7cb342',

                            },

                            secondary: {

                            main: '#e53935',

                            },

                            },

                            });

  const navigate = useNavigate();
  useEffect(() => {
    onAuthChange(async (user: any) => {
      if (user) {
        navigate('/dashboard');
        dispatch(setUser(await getLoggedInUser(user)));
      } else {
        navigate('/landing');
        dispatch(setUser(null));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/dashboard' element={
        <PrivateRoute>
        <DashboardPage />
         </PrivateRoute>
        } />
        <Route
          path='/covid-19-condition-search'
          element={
           <PrivateRoute>
          <CovidSearchPage />
           </PrivateRoute>
          }
        />
        <Route path='/places-search' element={
         <PrivateRoute>
        <PlacesSearchPage />
         </PrivateRoute>
        } />
      </Routes>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
