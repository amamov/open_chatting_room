// App.js
import React, { useState, useEffect } from "react";
import AppRouter from "components/AppRouter";
import { authService } from "firebasePack";

function App() {
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Auth State가 바뀔 때 user data를 가져온다.
      if (user) {
        setUserObj(user);
        // setIsLoggedIn(true);
      }
      //   else {
      //     setIsLoggedIn(false);
      //   }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "initializing..."
      )}
      <footer>&copy; Yoon - Sang Seok {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
