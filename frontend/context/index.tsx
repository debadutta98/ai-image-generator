'use client';

import { AppContext, AppContextProps } from '@/types';
import { createContext, use, useState } from 'react';

const context = createContext<AppContext>({
  auth: false,
  openLoginModal: false,
  openLoginScreen: () => undefined,
  closeLoginScreen: () => undefined,
  setAuth: (a: boolean) => undefined
});

export default function AppProviderContext(props: AppContextProps) {
  const [showLogin, setShowLogin] = useState<boolean>(!props.value.auth);
  const [auth, setAuth] = useState<boolean>(props.value.auth);
  const openLoginScreen = () => {
    if (!props.value.auth && !showLogin) {
      setShowLogin(true);
    }
  };
  const closeLoginScreen = () => {
    if (!props.value.auth && showLogin) {
      setShowLogin(false);
    }
  };

  return (
    <context.Provider
      value={{
        ...props.value,
        openLoginModal: showLogin,
        openLoginScreen,
        closeLoginScreen,
        auth,
        setAuth
      }}
    >
      {props.children}
    </context.Provider>
  );
}

export const useAppContext = () => use(context);
