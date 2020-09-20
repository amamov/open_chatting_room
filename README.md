# firebase/auth

- useEffect(() => {
  authService.onAuthStateChanged((user) => {
  if (user) {
  setUserObj(user);
  }
  setInit(true);
  });
  }, []);

- const onSubmit = async (event) => {
  event.preventDefault();
  if (isNewAccount) {
  // 회원가입
  await authService.createUserWithEmailAndPassword(email, password);
  } else {
  // 로그인
  await authService.signInWithEmailAndPassword(email, password);
  }
  };

- const onSocialLogInClick = async (event) => {
  const {
  target: { name },
  } = event;
  let provider;
  if (name === "google") {
  // google로 로그인
  provider = new firebaseInstance.auth.GoogleAuthProvider();
  } else if (name === "github") {
  // github로 로그인
  provider = new firebaseInstance.auth.GithubAuthProvider();
  }
  authService.signInWithPopup(provider);
  };
