// // UserContext.js
// import { createContext, useContext, useState } from 'react';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const setUserId = (newUserId) => {
//     setUser(newUserId);
//   };

//   return (
//     <UserContext.Provider value={{ userId: user, setUserId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   return useContext(UserContext);
// };
// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const setUser = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};