// Home.js
import React, { useState, useEffect } from "react";
import { dbService } from "firebasePack";
import Chat from "components/Chat";

const Home = ({ userObj }) => {
  const [chat, setChat] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    dbService.collection("chats").onSnapshot((snapshot) => {
      // onSnapshot : DB에서 CRUID를 알 수 있도록 해주는 것
      // console.log(snapshot.docs);
      const chatArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(chatArray);
      setChats(chatArray);
    });
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // DB의 collection "chats" 추가
      await dbService.collection("chats").add({
        text: chat,
        createAt: Date.now(),
        creatorId: userObj.uid,
      });
    } catch (err) {
      alert(err.message);
    }
    setChat("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={chat}
          onChange={onChange}
          placeholder="what's on your mind?"
          maxLength={20}
        />
        <input type="submit" value="chat" />
      </form>
      <div>
        {chats.map((chatObj) => (
          <Chat
            key={chatObj.id}
            chatObj={chatObj}
            isOwner={chatObj.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
