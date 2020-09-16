// Auth.js
import React, { useState } from "react";
import { authService, firebaseInstance } from "firebasePack";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      // 이메일 정보 저장
      setEmail(value);
    } else if (name === "password") {
      // 비밀번호 정보 저장
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault(); // ?
    if (isNewAccount) {
      // 회원가입
      try {
        await authService.createUserWithEmailAndPassword(email, password);
      } catch (err) {
        setError(err.message);
      }
    } else {
      // 로그인
      try {
        await authService.signInWithEmailAndPassword(email, password);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleAccount = () => {
    setIsNewAccount((prev) => !prev);
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;

    let provider;
    if (name === "google") {
      // 구글로 로그인하기
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      // 깃허브로 로그인하기
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    try {
      await authService.signInWithPopup(provider);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
        />
        <input
          type="submit"
          value={isNewAccount ? "Create Account" : "Log In"}
        />
      </form>
      <div>
        <button onClick={toggleAccount}>
          {isNewAccount ? "Sign In" : "Sign up"}
        </button>
      </div>
      <span>{error}</span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with github
        </button>
      </div>
    </div>
  );
};

export default Auth;
