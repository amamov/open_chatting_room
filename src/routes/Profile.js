import React from "react";
// import { useHistory } from "react-router-dom";
import { authService } from "forebasePack";

const Profile = () => {
  // const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    // 로그아웃을 하게 되면 현재 라우트를 빠져나간다.
    // 라우트를 빠져나갈때, history.push("/")를 해준다.
    // history.push("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
