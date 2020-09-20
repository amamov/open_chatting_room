// Home.js
import React, { useState, useEffect } from "react";
import { dbService } from "firebasePack";
import ChatPresentor from "components/ChatPresentor";
import ChatFactory from "components/ChatFactory";

const Home = ({ userObj }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    dbService
      .collection("chats")
      .orderBy("createAt")
      .onSnapshot((snapshot) => {
        const chatArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setChats(chatArray);
      });
  }, []);

  return (
    <div>
      <ChatFactory userObj={userObj} />
      <div>
        {chats.map((chatObj) => (
          <ChatPresentor
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
