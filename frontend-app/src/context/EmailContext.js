// EmailContext.js

import { createContext, useContext, useState } from 'react';

const EmailContext = createContext();

export function useEmail() {
  return useContext(EmailContext);
}

export function EmailProvider({ children }) {
  const [emailValue, setEmailValue] = useState('');

  return (
    <EmailContext.Provider value={{ emailValue, setEmailValue }}>
      {children}
    </EmailContext.Provider>
  );
}
