// Profile.js
import React from "react";
import { authService } from "firebasePack";

const Profile = () => {
  const onLogOutClick = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <button onClick={onLogOutClick}>Sign Out</button>
    </>
  );
};

export default Profile;
