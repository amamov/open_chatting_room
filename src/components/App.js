// App.js
import React, { useState, useEffect } from "react";
import { authService } from "firebasePack";
import AppRouter from "./AppRouter";

function App() {
  const [userObj, setUserObj] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Auth State가 바뀔 때 user data를 가져온다.
      if (user) {
        // setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }

      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    // 만약 user의 정보가 업데이트 되었다면 실행 시켜줄 함수
    // setUserObj(authService.currentUser);
    // react는 state가 변경되면 다시 랜더링 한다. 하지만
    // authService.currentUser의 객체 깊이가 깊은 부분을 수정하면 state의 변경상태를 체크를 하지 못하고
    // 랜더링을 안하는 경우가 있다.
    // 따라서 setUserObj(authService.currentUser);가 작동을 잘 안하는 것이다. (객체가 거대하기 때문에)
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
