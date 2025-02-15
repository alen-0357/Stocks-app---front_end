// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
