import React, { useState } from 'react';

const UserContext = React.createContext();

function getUserFromLocalStorage() {
  return localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : { username: null, token: null };
}

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromLocalStorage());
  const [alert, setAlert] = useState({ show: false, msg: '', type: 'success' });

  const userLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const userLogout = (user) => {
    setUser({ username: null, token: null });
    localStorage.removeItem('user');
  };

  const showAlert = ({ type = 'success', msg }) => {
    setAlert({ show: true, msg, type });
  };

  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };
  return (
    <UserContext.Provider
      value={{ user, userLogin, userLogout, alert, hideAlert, showAlert }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
