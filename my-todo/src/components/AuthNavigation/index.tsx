import * as React from 'react';
import { Button } from '@material-ui/core';
import Link from 'next/link';
import { useAuthState, useAuthDispatch } from '../../contexts/auth';
import Cookie from 'js-cookie';
import { redirectAtClient } from '../../utils/redirect';

export function AuthNavigation() {
  const { token } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    Cookie.remove('token');
    dispatch({ type: 'DELETE_TOKEN' });
    redirectAtClient('/login');
  }

  const component = !token ? (
    <Link href='/login'>
      <Button color="inherit">Login</Button>
    </Link>
  ) : (
      <Button onClick={handleLogout} color="inherit">Logout</Button>
    );

  return component;
}
