import React from 'react';
import Head from 'next/head';
import LockIcon from '@material-ui/icons/Lock';
import { Divider, Box, Grid, TextField, Button, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as Cookie from 'js-cookie';
import { useAuthDispatch, useAuthState } from '../../contexts/auth';
import { redirectAtClient, redirectAtServer } from '../../utils/redirect';
import Alert from '@material-ui/lab/Alert';
import { API_END_POINT } from '../../utils/constants';
import { withHeader } from '../../hoc/withHeader';

const useStyles = makeStyles(() => ({
  wrapper: {
    'max-width': 500,
    margin: '0 auto',
  },
}));

function LogIn() {
  const dispatch = useAuthDispatch();
  const { error } = useAuthState();

  const classes = useStyles();

  const handleLogInClick = async () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const response = await fetch(`${API_END_POINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const { status, data, error } = await response.json();

    switch (status) {
      case 'success':
        dispatch({ type: 'AUTH_SUCCESS', data });
        Cookie.set('token', data.token);
        redirectAtClient('/todo-list');
        break;
      case 'error':
        dispatch({ type: 'AUTH_FAIL', error: error.message });
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Box p={3}>
        <section className={classes.wrapper}>
          <form>
            <Grid style={{ textAlign: 'center' }} container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <LockIcon color="secondary" fontSize="large" />
                <Typography variant="h6">
                  <strong>Log In</strong>
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  variant="outlined"
                  label="Username"
                  type="text"
                  autoComplete="off"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  variant="outlined"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Button fullWidth onClick={handleLogInClick} variant="contained" color="primary">
                  Log In
              </Button>
              </Grid>
            </Grid>

            {error && (
              <Box mt={2} mb={2}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            <Box mt={2} mb={2}>
              <Divider />
            </Box>

            <Grid container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Link href="/register">
                  <Button fullWidth>Create New Account</Button>
                </Link>
              </Grid>
            </Grid>
          </form>
        </section>
      </Box>
    </>
  );
}

export default withHeader(LogIn);

export async function getServerSideProps({ req, res }) {
  const { cookies } = req;

  if (cookies.token) {
    redirectAtServer(res, '/');
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
