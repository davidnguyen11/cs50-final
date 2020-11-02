import React, { useState } from 'react';
import Head from 'next/head';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Grid, TextField, Button, Snackbar, Typography, Box, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { redirectAtClient, redirectAtServer } from '../../utils/redirect';
import { API_END_POINT } from '../../utils/constants';
import { withHeader } from '../../hoc/withHeader';

const useStyles = makeStyles(() => ({
  wrapper: {
    'max-width': 500,
    margin: '0 auto',
  },
}));

function Register() {
  const classes = useStyles();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState(undefined);

  const handleRegister = async () => {
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;

    const response = await fetch(`${API_END_POINT}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, username, password, email })
    });

    const { status, error } = await response.json();

    switch (status) {
      case 'success':
        setOpenSnackBar(true);
        break;
      case 'error':
        setError(error.message);
        break;
    }
  };

  const handleClose = () => {
    setOpenSnackBar(false);
    redirectAtClient('/login');
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

      <Box p={3}>
        <section className={classes.wrapper}>
          <form>
            <Grid style={{ textAlign: 'center' }} container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <VpnKeyIcon color="secondary" fontSize="large" />
                <Typography variant="h6">
                  <strong>Register</strong>
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  fullWidth
                  required
                  id="firstName"
                  variant="outlined"
                  label="First name"
                  type="text"
                />
              </Grid>

              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  fullWidth
                  required
                  id="lastName"
                  variant="outlined"
                  label="Last name"
                  type="text"
                />
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
                  autoComplete="username"
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
                <TextField
                  required
                  fullWidth
                  id="email"
                  variant="outlined"
                  label="Email"
                  type="email"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Button fullWidth onClick={handleRegister} variant="contained" color="primary">
                  Submit
              </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Box mt={2} mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </section>
      </Box>
      <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="success">Created account successfully!</Alert>
      </Snackbar>
    </>
  );
}

export default withHeader(Register);

export async function getServerSideProps({ req, res }) {
  const { cookies } = req;

  if (cookies.token) {
    redirectAtServer(res, '/');
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
