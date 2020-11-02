import * as React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '../theme';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class MyApp extends App<Props> {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, classes } = this.props;

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <header className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="menu"></IconButton>
                <Typography variant="h6" className={classes.title}>
                  devtool
                </Typography>
              </Toolbar>
            </AppBar>
          </header>

          <Box mt={2}>
            <Component {...pageProps} />
          </Box>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MyApp);

interface Props {
  classes: {
    root: string;
    menuButton: string;
    title: string;
  };
}
