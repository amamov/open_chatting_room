import React, { useState, useEffect } from "react";
import { dbService } from "forebasePack";

const Home = ({ userObj }) => {
  const [chat, setChat] = useState("");
  const [chats, setChats] = useState([]);

  //   const getChats = async () => {
  //     const dbChats = await dbService.collection("chats").get();
  //     // console.log(dbChats);
  //     dbChats.forEach((document) => {
  //       const chatObj = {
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setChats((prev) => [chatObj, ...prev]);
  //     });
  //     // console.log(document.data());
  //   };

  useEffect(() => {
    // getChats();

    dbService.collection("chats").onSnapshot((snapshot) => {
      // onSnapshot DB에서 CRUID를 알 수 있도록 해주는 것
      // console.log("Something Change");
      console.log(snapshot.docs);
      const chatArray = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      console.log(chatArray);
      setChats(chatArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("chats").add({
      text: chat,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setChat("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setChat(value);
  };
  // console.log(userObj);
  // console.log(chats);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={chat}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Chat" />
      </form>
      <div>
        {chats.map((chatObj) => (
          <div key={chatObj.id}>
            <h4>{chatObj.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
