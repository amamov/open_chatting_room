// Profile.js
import React, { useEffect, useState } from "react";
import { authService, dbService } from "firebasePack";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const MyProfile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myChats, setMyChats] = useState([]);

  const onLogOutClick = async () => {
    // 로그아웃
    await authService.signOut();
    // history.push("/");
    history.go(0); // 새로고침
  };

  const getMychat = async () => {
    // chats collection 에서 where 함수로 필터링해서 데이터를 가져온다.
    // orderBy("createAt")으로 하면 "The query requires an index" 에러가 난다.
    // pre-made query를 만들어야 한다.
    // 즉, 우리가 이 쿼리를 사용할 거라고 DB에 알려주어야 한다.
    // 처음 실행하고 에러 메세지의 url을 들어가면 쿼리 생성을 도와준다.
    const myChatPromiseObjs = await dbService
      .collection("chats")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createAt")
      .get();
    const myChatArray = myChatPromiseObjs.docs.map((doc) => doc.data());
    setMyChats(myChatArray);
  };

  useEffect(() => {
    getMychat();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // 변경사항이 생길때만 작업을 진행한다.
      // displayName과 photo만 바꿀 수 있다.
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          onChange={onChange}
          placeholder="Display name"
        />
        <input type="submit" placeholder="Update profile" />
      </form>
      <button onClick={onLogOutClick}>Sign Out</button>
      {myChats.map((chatObj) => (
        <div key={uuidv4()}>{chatObj.text}</div>
      ))}
    </>
  );
};

export default MyProfile;
