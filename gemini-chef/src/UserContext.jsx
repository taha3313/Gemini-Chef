import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(
    
);

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
