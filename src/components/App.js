import React, { useState, useEffect } from "react";
import RouterComponent from "components/RouterComponent";
import { authService } from "forebasePack";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // 현재 유저를 객체로 저장
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <RouterComponent isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
