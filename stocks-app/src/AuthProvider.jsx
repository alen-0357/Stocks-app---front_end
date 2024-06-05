// Assuming this is part of your authentication code
import React, { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged} from "./firebase.config";
import { auth } from "./firebase.config";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//       if (authUser) {
//         // Log the user ID to the console
//         console.log('User ID:', authUser.uid);
//         setUser(authUser);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import { useUser } from "./UserContext";

const AuthProvider = ({ children }) => {
  const { setUser } = useUser();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Log the user ID to the console
        console.log('User ID:', authUser.uid);
        setUser(authUser.uid);
      } else {
        setUser(null); // Reset user ID to null on logout
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
};

export default AuthProvider;