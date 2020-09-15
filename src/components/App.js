// App.js
import React, { useState, useEffect } from "react";
import RouterComponent from "components/RouterComponent";
import { authService } from "forebasePack";

function App() {
  // console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
    });
  }, []);
  return (
    <>
      {init ? <RouterComponent isLoggedIn={isLoggedIn} /> : "initializing"}
      <footer>&copy; Yoon - Sang Seok {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
