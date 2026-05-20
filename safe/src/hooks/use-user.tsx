import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ContactInfo = {
  id: string;
  contactCode: string;
  name: string;
  role: string;
  status: string;
  email?: string;
  phone?: string;
};

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
  uniqueCode: string;
  contacts: ContactInfo[];
};

export type NewUserInfo = {
  name: string;
  email: string;
  phone: string;
};

const defaultUserInfo: UserInfo = {
  name: 'SafeGuard User',
  email: 'user@safe.io',
  phone: '+1 (555) 000-0000',
  uniqueCode: 'SG0000',
  contacts: [],
};

const sampleRegisteredUsers: Record<string, UserInfo> = {
  MG1234: {
    name: 'Maya Grant',
    email: 'maya.grant@safe.io',
    phone: '+1 (555) 111-2222',
    uniqueCode: 'MG1234',
    contacts: [],
  },
  AL4321: {
    name: 'Alex Lee',
    email: 'alex.lee@safe.io',
    phone: '+1 (555) 333-4444',
    uniqueCode: 'AL4321',
    contacts: [],
  },
};

const UserContext = createContext<{
  user: UserInfo;
  setUser: (user: UserInfo) => void;
  registerUser: (userInfo: NewUserInfo) => UserInfo;
  findUserByCode: (code: string) => UserInfo | undefined;
  addContactByCode: (contactCode: string, role: string) => { success: boolean; message: string };
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(defaultUserInfo);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, UserInfo>>(sampleRegisteredUsers);

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

    const fullUser: UserInfo = {
      ...defaultUserInfo,
      ...userInfo,
      uniqueCode,
      contacts: [],
    };

    setRegisteredUsers((current) => ({
      ...current,
      [uniqueCode]: fullUser,
    }));
    setUser(fullUser);

    return fullUser;
  }, [generateCode, registeredUsers]);

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

      setUser((current) => ({
        ...current,
        contacts: [
          ...current.contacts,
          {
            id: normalizedCode,
            contactCode: normalizedCode,
            name: matchingUser.name,
            role: role || 'Trusted Contact',
            status: 'Active',
            email: matchingUser.email,
            phone: matchingUser.phone,
          },
        ],
      }));

      return { success: true, message: `${matchingUser.name} has been added.` };
    },
    [registeredUsers, user]
  );

  const updateUser = useCallback((userInfo: UserInfo) => {
    setUser({
      ...defaultUserInfo,
      ...userInfo,
      uniqueCode: userInfo.uniqueCode ?? defaultUserInfo.uniqueCode,
      contacts: userInfo.contacts ?? defaultUserInfo.contacts,
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: updateUser,
      registerUser,
      findUserByCode,
      addContactByCode,
    }),
    [user, updateUser, registerUser, findUserByCode, addContactByCode]
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
