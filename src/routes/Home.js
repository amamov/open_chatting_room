// Home.js
import React, { useState, useEffect } from "react";
import { dbService, storageService } from "firebasePack";
import Chat from "components/Chat";
// yarn add uuid
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [chat, setChat] = useState("");
  const [chats, setChats] = useState([]);
  const [fileAttachment, setFileAttachment] = useState("");

  useEffect(() => {
    dbService.collection("chats").onSnapshot((snapshot) => {
      // DB의 collection이 변화가 생겼을떄 실행이 되는 함수
      // console.log(snapshot.docs);
      const chatArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(chatArray);
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

    let attachmentUrl = "";

    if (fileAttachment !== "") {
      // 이미지 파일에 대한 reference를 firebase의 storage에 저장한다.
      // 먼저 파일에 대한 reference를 만들고 그후에 파일을 업데이트한다.

      // 이미지 파일을 유저와 연결한다. & 파일에 대한 reference를 만든다.
      // userObj.uid 폴더에 uuidv4()라는 이름의 데이터를 저장할 reference를 만든다.
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      // 파일의 reference에 (data, format)으로 이미지 데이터를 reference에 저장한다.
      const response = await attachmentRef.putString(
        fileAttachment,
        "data_url"
      ); // data_url : code **의 reader.readAsDataURL(theFile)

      // reference에서 사진에 대한 url을 받아온다.
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const chatObj = {
      text: chat,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("chats").add(chatObj);

    setChat("");
    setFileAttachment("");
  };

  const onFileChange = (event) => {
    // console.log(event.target.files);
    const {
      target: { files },
    } = event;
    // console.log(files);

    const theFile = files[0];
    // console.log(theFile);

    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      // 읽기 동작이 끝났을 때마다 발생
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      console.log(result);
      setFileAttachment(result);
    };

    // 이미지를 브라우저에서 볼 수 있도록 한다.
    reader.readAsDataURL(theFile); // code **
  };

  const onClearAttachmentClick = () => setFileAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={chat}
          onChange={onChange}
          placeholder="what's on your mind?"
        />
        <input type="submit" value="chat" />
        {/* 이미지 업로드 */}
        <input type="file" accept="image/*" onChange={onFileChange} />
        {fileAttachment && (
          <div>
            <img src={fileAttachment} width="50px" height="50px" />
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {chats.map((chatObj) => {
          return (
            <Chat
              key={chatObj.id}
              chatObj={chatObj}
              isOwner={chatObj.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
