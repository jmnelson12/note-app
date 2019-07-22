import React, { createContext, useState } from "react";
const { Provider, Consumer } = createContext();

const UserProvider = ({ children, user, loggedIn }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(loggedIn);
  const [userData, setUserData] = useState(user);

  return (
    <Provider
      value={{
        userLoggedIn,
        setUserLoggedIn,
        userData,
        setUserData
      }}
    >
      {children}
    </Provider>
  );
};

export { UserProvider };

// making this default because it will be used most
export default Consumer;
