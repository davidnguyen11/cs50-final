import React, { useEffect } from 'react';
import Cookie from 'js-cookie';

type Action = ActionAuthSuccess | ActionAuthFail | ActionDeleteToken;

interface ActionAuthSuccess {
  type: 'AUTH_SUCCESS';
  data: { token: string };
}

interface ActionAuthFail {
  type: 'AUTH_FAIL';
  error: string;
}

interface ActionDeleteToken {
  type: 'DELETE_TOKEN';
}

type Dispatch = (action: Action) => void;
type State = {
  token: string;
  error?: string;
};
type AuthProviderProps = { children: React.ReactNode };

export const AuthStateContext = React.createContext<State | undefined>(undefined);
export const AuthDispatchContext = React.createContext<Dispatch | undefined>(undefined);

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        error: undefined,
        token: action.data.token
      }
    case 'AUTH_FAIL':
      return {
        ...state,
        token: undefined,
        error: action.error,
      }
    case 'DELETE_TOKEN':
      return {
        ...state,
        error: undefined,
        token: undefined,
      }
    default:
      throw new Error(`Unhandled action type`);
  }
}

function AuthProvider({children}: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, {
    token: undefined, error: undefined
  });

  useEffect(() => {
    if (Cookie.get('token') && !state.token) {
      dispatch({ type: 'AUTH_SUCCESS', data: { token: Cookie.get('token') } })
    }
  });

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

function useAuthState() {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a CountProvider')
  }
  return context
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a CountProvider')
  }
  return context
}

export { AuthProvider, useAuthState, useAuthDispatch };
