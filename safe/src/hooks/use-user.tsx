import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
};

const defaultUserInfo: UserInfo = {
  name: 'SafeGuard User',
  email: 'user@safe.io',
  phone: '+1 (555) 000-0000',
};

const UserContext = createContext<{
  user: UserInfo;
  setUser: (user: UserInfo) => void;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(defaultUserInfo);

  const updateUser = useCallback((userInfo: UserInfo) => {
    setUser(userInfo);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: updateUser,
    }),
    [user, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
