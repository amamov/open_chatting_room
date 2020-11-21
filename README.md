# Firebase + React 기본 모델

- firebasepkg.js

```javascript
// firebasepkg.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};
firebase.initializeApp(firebaseConfig);

export default firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
```

---

## [Auth](https://firebase.google.com/docs/reference/js/firebase.auth?authuser=0)

    - google service 이용하기 -> 그냥 체크하면 이용 가능

    - github service 이용하기
        1. github -> settings -> Developer settings -> OAuth Apps -> New OAuth App
        2. firebase github 설정에서 복사 https://firereact-study.firebaseapp.com/__/auth/handler
            - <Homepage URL> : https://firereact-study.firebaseapp.com
            - <Authorization callback URL> : https://firereact-study.firebaseapp.com/__/auth/handler
        3. 발급 받은 Client ID, Client secrets를 firebase github 설정에 입력한다.

### [authService = firebase.auth();](https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0)

    1. authService.currentUser
        - authService에 설정해 놓은 Persistence에 따라 user 정보를 가져온다.
        - user가 log되어 있으면 user 정보를 리턴하고 없으면 null이다.
        - return : User | null

    2. authService.createUserWithEmailAndPassword(email, password);
        - email, password를 이용하여 회원가입한다.
        - 회원가입에 성공하면 즉시 로그인된다. (authService.currentUser에 user가 log된다.)
        - return : Promise<UserCredential>

    3. authService.signInWithEmailAndPassword(email, password);
        - email, password를 이용하여 로그인한다.
        - 로그인에 성공하면 authService.currentUser에 user가 log된다.
        - return : Promise<UserCredential>

    4. authService.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        - 브라우저가 사용자를 어떻게 기억하는지 설정한다.
        - Persistence: { LOCAL: Persistence; NONE: Persistence; SESSION: Persistence }
        - React Native와 Web Browser에서의 초기값은 LOCAL이다.
        - return :  Promise < void >

```javascript
useEffect(() => {
  authService.setPersistence(firebase.auth.Auth.Persistence.SESSION);
}, []);
```

    5. authService.onAuthStateChanged((user)=>{if(user){}else{}});
        - authService의 로그인 상태의 변화를 관찰하는 관찰자이다.
        - 로그인 유무, User의 정보 변화에 따라 이벤트를 발생할 수 있다.

```javascript
const [init, setInit] = useState(false);

useEffect(() => {
  authService.onAuthStateChanged((user) => {
    if (user) {
      // user를 가져온다.
      // DB에 저장할때 user.uid로 creatorId를 저장할 수 있다.
    }
    setInit(true);
  });
}, []);
```

    6. authService.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        - Social Login
        - 즉시 로그인된다.
        - return : Promise<ConfirmationResult>

```javascript
<Button onClick={socialLogIn} />;

const socialLogIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const user = await authService.signInWithPopup(provider);
};
```

    7. authService.signOut();
        - 로그아웃
        - return : Promise < void >

---

## Firestore

- DB 위치 : 글로벌 서비스면 nam5, 한국이면 northeast3 또는 2

#### [dbService = firebase.firestore();](https://firebase.google.com/docs/reference/js/firebase.firestore.Firestore?authuser=0#index)

    1. dbService.collection("myCollection").add({data})

      - myCollection에 접속하여 myCollection에 data를 저장한다.
      - add ( data : T ) : Promise < DocumentReference < T > >

```javascript
await dbService.collection("myCollection").add({
  data,
  creatorId: user.uid,
  createAt: Date.now(),
});
```

    2. dbService.collection("myCollection").get()

      - myCollection에 접속하여 데이터를 가져온다.
      - get ( options ? : GetOptions ) : Promise < QuerySnapshot < T > >

```javascript
const documents = await dbService.collection("myCollection").get();
documents.forEach((document) => {
  const docObj = {
    id: document.id,
    ...document.data(),
  };
  console.log(dicObj);
});
```

    3. dbService.collection("myCollection").onSnapshot((snapshot) => {})

      - 데이터가 CRUID 될때마다 바로 실행된다. (Real-Time)
      - dbService.collection("myCollection")의 관찰자이다.
      - 주로 CRUID된 데이터를 실시간으로 가져올때 사용한다. (2번의 .get 대신 사용가능)

```javascript
useEffect(() => {
  dbService.collection("myCollection").onSnapshot((snapshot) => {
    // 데이터의 변화를 실시간으로 반응한다.
    const data = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    setData(data);
  });
}, []);
```

    4. dbService.doc(`myCollecttion/${document.id}`).delete();

      - myCollection 안에 있는 document를 삭제한다.
      - delete ( ) : Promise < void >

    5. dbService.doc(`myCollecttion/${document.id}`).update({newdata});

      - data를 수정한다.
      - 객체의 수정하고 싶은 key의 value만 바꾸면 나머지 데이터는 그대로 유지되고 바꾼 데이터만 바꿔서 DB에 저장된다.
      - update ( data :  UpdateData ) : Promise < void >

    6. dbService.collection("myCollecttion").where("creatorId", "==", userObj.uid).orderBy("createAt").get();

      - DB 조건 조회
      - orderBy("createAt")으로 하면 "The query requires an index" 에러가 난다. pre-made query를 만들어야 한다.
       즉, 우리가 이 쿼리를 사용할 거라고 DB에 알려주어야 한다.  처음 실행하고 에러 메세지의 url을 들어가면 쿼리 생성을 도와준다.

---

## Storage

- 이미지, 미디어 등을 저장할 수 있는 버킷 서비스이다.

- 사진을 브라우저가 읽을 수 있도록 string 형식으로 변환 후 해당 string 데이터를 storage에 저장한다.

```javascript
const [fileString, setFileString] = useState();

...

const onFileChange = ({ target: { files } }) => {
  console.log(files);
  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file); // 해당 파일을 읽는다.
  reader.onloadend = (finishedEvent) => {
    // 파일을 읽은 후에 실행된다.
    console.log(finishedEvent);
    setFileString(finishedEvent.currentTarget.result);
  };
};

...

<input type="file" accept="image/*" onChange={onFileChange} />
```

#### dbService = firebase.firestore();

    1. storageService.ref().child(`${user.uid}/${uuidv4()}`);
      - Returns a reference to a relative path from this reference.
      - strage에 상대경로를 이용하여 refernce를 만든다. user.uid 폴더 안에 uuidv4()라는 refernce를 만든다.
      - child ( path :  string ) : Reference

    2. fileRef.putString(fileString, "data_url");
      - fileRef = storageService.ref().child(`${user.uid}/${uuidv4()}`)
      - fileRef라는 refernce에 fileString이라는 데이터(이미지)를 저장한다.
      - putString ( data :  string ,  format ? :  StringFormat ,  metadata ? :  UploadMetadata ) : UploadTask

    3. fileRef.putString(fileString, "data_url").ref.getDownloadURL();
      - fileRef라는 refernce에 fileString이라는 데이터(이미지)를 저장하고 해당 이미지의 url을 받아온다.
      - getDownloadURL ( ) : Promise < any >

    4. storageService.refFromURL(fileUrl).delete();
      - file의 url로부터 해당 file의 refernce에 접근할 수 있다. 접근 후에 delete()로 버킷에서 해당 file을 지운다.

```javascript
const fileRef = storageService.ref().child(`${user.uid}/${uuidv4()}`); // 저장할 위치를 정하고
const response = await fileRef.putString(fileString, "data_url"); // 파일을 저장한다.
const downloadedFileUrl = await response.ref.getDownloadURL(); // 저장한 파일을 다운 받는다.
console.log(downloadedFileUrl);
// downloadedFileUrl을 collection에 저장하여 관리할 수 있다.
```
