import { Box } from '@material-ui/core';
import React from 'react';
import { Header } from '../components/Header';

export function withHeader(WrappedComponent) {
  return class extends React.Component {
    public render() {
      return (
        <>
          <Header />
          <Box mt={2}>
            <WrappedComponent {...this.props} />
          </Box>
        </>
      )
    }
  }
}
