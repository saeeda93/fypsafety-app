import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ContactInfo = {
  id: string;
  contactCode: string;
  name: string;
  role: string;
  status: string;
  sharingEnabled?: boolean;
  email?: string;
  phone?: string;
};

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
  uniqueCode: string;
  contacts: ContactInfo[];
  incomingContacts: ContactInfo[];
};

export type RegisteredUser = UserInfo & {
  password: string;
};

export type NewUserInfo = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const STORAGE_KEYS = {
  user: 'SAFE_USER',
  registeredUsers: 'SAFE_REGISTERED_USERS',
  authenticated: 'SAFE_AUTHENTICATED',
};

const defaultUserInfo: UserInfo = {
  name: 'SafeGuard User',
  email: 'user@safe.io',
  phone: '+1 (555) 000-0000',
  uniqueCode: 'SG0000',
  contacts: [],
  incomingContacts: [
    {
      id: 'MG1234',
      contactCode: 'MG1234',
      name: 'Maya Grant',
      role: 'Trusted Contact',
      status: 'Offline',
      sharingEnabled: true,
      email: 'maya.grant@safe.io',
      phone: '+1 (555) 111-2222',
    },
    {
      id: 'AL4321',
      contactCode: 'AL4321',
      name: 'Alex Lee',
      role: 'Trusted Contact',
      status: 'Online',
      sharingEnabled: true,
      email: 'alex.lee@safe.io',
      phone: '+1 (555) 333-4444',
    },
  ],
};

const sampleRegisteredUsers: Record<string, RegisteredUser> = {
  MG1234: {
    name: 'Maya Grant',
    email: 'maya.grant@safe.io',
    phone: '+1 (555) 111-2222',
    uniqueCode: 'MG1234',
    password: 'password123',
    contacts: [],
    incomingContacts: [],
  },
  AL4321: {
    name: 'Alex Lee',
    email: 'alex.lee@safe.io',
    phone: '+1 (555) 333-4444',
    uniqueCode: 'AL4321',
    password: 'secure123',
    contacts: [],
    incomingContacts: [],
  },
};

const UserContext = createContext<{
  user: UserInfo;
  authenticated: boolean;
  setUser: (user: UserInfo) => void;
  registerUser: (userInfo: NewUserInfo) => UserInfo;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  findUserByCode: (code: string) => UserInfo | undefined;
  addContactByCode: (contactCode: string, role: string) => { success: boolean; message: string };
  updateContact: (contactCode: string, updates: Partial<ContactInfo>) => void;
  removeContact: (contactCode: string) => void;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(defaultUserInfo);
  const [authenticated, setAuthenticated] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, RegisteredUser>>(sampleRegisteredUsers);
  const [isInitialized, setIsInitialized] = useState(false);

  const persistState = useCallback(async (nextUser: UserInfo, nextAuthenticated: boolean, nextRegisteredUsers: Record<string, RegisteredUser>) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.registeredUsers, JSON.stringify(nextRegisteredUsers));
      await SecureStore.setItemAsync(STORAGE_KEYS.authenticated, nextAuthenticated ? 'true' : 'false');

      if (nextAuthenticated) {
        await SecureStore.setItemAsync(STORAGE_KEYS.user, JSON.stringify(nextUser));
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.user);
      }
    } catch {
      // Ignore persistence failures for now.
    }
  }, []);

  const generateCode = useCallback((name: string, existingCodes: Set<string>) => {
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('')
      .padEnd(2, 'X');

    let candidate = `${initials}${Math.floor(1000 + Math.random() * 9000)}`;
    while (existingCodes.has(candidate)) {
      candidate = `${initials}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return candidate;
  }, []);

  const registerUser = useCallback((userInfo: NewUserInfo) => {
    const existingCodes = new Set(Object.keys(registeredUsers));
    const uniqueCode = generateCode(userInfo.name, existingCodes);

    const fullUser: RegisteredUser = {
      ...defaultUserInfo,
      ...userInfo,
      uniqueCode,
      contacts: [],
      incomingContacts: [
        {
          id: 'MG1234',
          contactCode: 'MG1234',
          name: 'Maya Grant',
          role: 'Trusted Contact',
          status: 'Offline',
          email: 'maya.grant@safe.io',
          phone: '+1 (555) 111-2222',
        },
        {
          id: 'AL4321',
          contactCode: 'AL4321',
          name: 'Alex Lee',
          role: 'Trusted Contact',
          status: 'Online',
          email: 'alex.lee@safe.io',
          phone: '+1 (555) 333-4444',
        },
      ],
    };

    const nextRegisteredUsers = {
      ...registeredUsers,
      [uniqueCode]: fullUser,
    };

    setRegisteredUsers(nextRegisteredUsers);
    setUser(fullUser);
    setAuthenticated(true);
    persistState(fullUser, true, nextRegisteredUsers);

    return fullUser;
  }, [generateCode, persistState, registeredUsers]);

  const login = useCallback(
    (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const matchingUser = Object.values(registeredUsers).find(
        (storedUser) => storedUser.email.toLowerCase() === normalizedEmail
      );

      if (!matchingUser || matchingUser.password !== password) {
        return { success: false, message: 'Invalid email or password.' };
      }

      setUser(matchingUser);
      setAuthenticated(true);
      persistState(matchingUser, true, registeredUsers);
      return { success: true, message: 'Welcome back.' };
    },
    [persistState, registeredUsers]
  );

  const logout = useCallback(() => {
    setAuthenticated(false);
    setUser(defaultUserInfo);
    persistState(defaultUserInfo, false, registeredUsers);
  }, [persistState, registeredUsers]);

  const findUserByCode = useCallback(
    (code: string) => registeredUsers[code.toUpperCase()],
    [registeredUsers]
  );

  const addContactByCode = useCallback(
    (contactCode: string, role: string) => {
      const normalizedCode = contactCode.trim().toUpperCase();
      if (!normalizedCode) {
        return { success: false, message: 'Enter the contact code from the app.' };
      }

      const matchingUser = registeredUsers[normalizedCode];
      if (!matchingUser) {
        return { success: false, message: 'No registered user found for that code.' };
      }

      if (matchingUser.uniqueCode === user.uniqueCode) {
        return { success: false, message: 'You cannot add yourself as a contact.' };
      }

      if (user.contacts.some((contact) => contact.contactCode === normalizedCode)) {
        return { success: false, message: 'This contact is already added.' };
      }

      setUser((current) => {
        const nextUser = {
          ...current,
          contacts: [
            ...current.contacts,
            {
              id: normalizedCode,
              contactCode: normalizedCode,
              name: matchingUser.name,
              role: role || 'Trusted Contact',
              status: 'Active',
              sharingEnabled: true,
              email: matchingUser.email,
              phone: matchingUser.phone,
            },
          ],
        };

        persistState(nextUser, authenticated, registeredUsers);
        return nextUser;
      });

      return { success: true, message: `${matchingUser.name} has been added.` };
    },
    [authenticated, persistState, registeredUsers, user]
  );

  const updateContact = useCallback(
    (contactCode: string, updates: Partial<ContactInfo>) => {
      setUser((current) => {
        const nextUser = {
          ...current,
          contacts: current.contacts.map((contact) =>
            contact.contactCode === contactCode ? { ...contact, ...updates } : contact
          ),
        };

        persistState(nextUser, authenticated, registeredUsers);
        return nextUser;
      });
    },
    [authenticated, persistState, registeredUsers]
  );

  const removeContact = useCallback(
    (contactCode: string) => {
      setUser((current) => {
        const nextUser = {
          ...current,
          contacts: current.contacts.filter((contact) => contact.contactCode !== contactCode),
        };

        persistState(nextUser, authenticated, registeredUsers);
        return nextUser;
      });
    },
    [authenticated, persistState, registeredUsers]
  );

  const updateUser = useCallback((userInfo: UserInfo) => {
    const nextUser = {
      ...defaultUserInfo,
      ...userInfo,
      uniqueCode: userInfo.uniqueCode ?? defaultUserInfo.uniqueCode,
      contacts: userInfo.contacts ?? defaultUserInfo.contacts,
      incomingContacts: userInfo.incomingContacts ?? defaultUserInfo.incomingContacts,
    };

    setUser(nextUser);
    persistState(nextUser, authenticated, registeredUsers);
  }, [authenticated, persistState, registeredUsers]);

  useEffect(() => {
    async function loadStoredState() {
      try {
        const storedUsers = await SecureStore.getItemAsync(STORAGE_KEYS.registeredUsers);
        const storedAuth = await SecureStore.getItemAsync(STORAGE_KEYS.authenticated);
        const storedUser = await SecureStore.getItemAsync(STORAGE_KEYS.user);

        if (storedUsers) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }

        if (storedAuth === 'true' && storedUser) {
          setUser(JSON.parse(storedUser));
          setAuthenticated(true);
        }
      } catch {
        // ignore
      } finally {
        setIsInitialized(true);
      }
    }

    loadStoredState();
  }, []);

  const value = useMemo(
    () => ({
      user,
      authenticated,
      setUser: updateUser,
      registerUser,
      login,
      logout,
      findUserByCode,
      addContactByCode,
      updateContact,
      removeContact,
    }),
    [user, authenticated, updateUser, registerUser, login, logout, findUserByCode, addContactByCode, updateContact, removeContact]
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
