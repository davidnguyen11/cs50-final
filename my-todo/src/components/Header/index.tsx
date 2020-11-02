import React from 'react';
import { Typography, makeStyles, AppBar, Toolbar } from '@material-ui/core';
import { AuthNavigation } from '../AuthNavigation';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

export function Header() {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>my todo</Typography>
          <AuthNavigation />
        </Toolbar>
      </AppBar>
    </header>
  );
}
