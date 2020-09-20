// Auth.js
import React, { useState } from "react";
import { authService, firebaseInstance } from "firebasePack";

const Auth = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = ({ target: { name, value } }) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isNewAccount) {
        // 회원가입
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        // 로그인
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const toggleAccount = () => setIsNewAccount((prev) => !prev);

  const onSocialLogInClick = async ({ target: { name } }) => {
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          value={email}
          onChange={onChange}
          placeholder="email"
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={onChange}
          placeholder="password"
        />
        <input
          type="submit"
          value={isNewAccount ? "Create Account" : "Log In"}
        />
      </form>
      <button onClick={toggleAccount}>
        {isNewAccount ? "Sign In" : "Sign Up"}
      </button>
      <div>
        <button name="google" onClick={onSocialLogInClick}>
          google
        </button>
        <button name="github" onClick={onSocialLogInClick}>
          github
        </button>
      </div>
      <span>{errorMessage}</span>
    </div>
  );
};

export default Auth;
