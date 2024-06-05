import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext';
import { auth, onAuthStateChanged } from './firebase.config';

// const Apps = () => {
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // User is signed in, update the user ID
//         setUser(user.uid);
//       } else {
//         // User is signed out, clear the user ID
//         setUser(null);
//       }
//     });

//     // Clean up the subscription when the component unmounts
//     return () => unsubscribe();
//   }, []);
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render---instead of ReactDOM.render~
root.render(
  <React.StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </React.StrictMode>
);
// export default Apps;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
