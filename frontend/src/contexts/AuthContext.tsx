import { createContext, ReactNode, useEffect, useState } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storaAuthTokenRemove } from '@storage/storageAuthToken';
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser';

import { api } from '@services/api'
import { UserDTO } from "@dtos/UserDTO";
import { setSignOutCallback } from '@functions/AuthManager';

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }
  
  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch(error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function singIn(email: string, password: string) {
    try {
      const {data} = await api.post('/auth/login', { email, password });
      if (data.user && data.token) {
        await storageUserAndTokenSave(data.user, data.token);
        userAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      
      setUser({} as UserDTO);
      await storageUserRemove();
      await storaAuthTokenRemove();

    } catch(error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if(userLogged && token) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch(error) {
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  } 

  useEffect(() => {
    loadUserData();
    setSignOutCallback(signOut);
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      singIn,
      signOut,
      isLoadingUserStorageData
   }}>
      {children}
    </AuthContext.Provider>
  )
}