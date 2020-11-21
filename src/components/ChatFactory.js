// Home.js
import React, { useState } from "react";
import { dbService, storageService } from "firebasePack";
// yarn add uuid
import { v4 as uuidv4 } from "uuid";

const ChatFactory = ({ userObj }) => {
  const [chat, setChat] = useState("");
  const [fileAttachment, setFileAttachment] = useState("");

  const onChange = ({ target: { value } }) => {
    setChat(value);
  };

  const onFileChange = ({ target: { files } }) => {
    // input으로 입력받은 파일을 FileReader로 URL로 읽는다.
    // console.log(files);
    const theFile = files[0];
    // console.log(theFile);
    const reader = new FileReader();
    // 이미지를 브라우저에서 볼 수 있도록 URL로 전달한다.
    reader.readAsDataURL(theFile);
    reader.onloadend = ({ currentTarget: { result } }) => {
      // 파일에 대한 읽기 동작이 끝났을 때 실행
      // console.log(result);
      setFileAttachment(result);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

    if (fileAttachment !== "") {
      // 파일을 저장할 reference를 만들고 유저와 연결한다.
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      // 파일의 reference에 (data, format)으로 이미지 데이터를 reference에 저장한다.
      const response = await attachmentRef.putString(
        fileAttachment,
        "data_url"
      ); // data_url : reader.readAsDataURL(theFile)

      // reference에서 사진에 대한 url을 받아온다.
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const chatObj = {
      text: chat,
      creatorId: userObj.uid,
      createAt: Date.now(),
      attachmentUrl,
    };

    await dbService.collection("chats").add(chatObj);
    setChat("");
    setFileAttachment("");
  };

  const onClearAttachmentClick = () => setFileAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={chat}
          onChange={onChange}
          placeholder="new chat !"
        />
        <input type="submit" value="chat" />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {fileAttachment && (
          <div>
            <img
              src={fileAttachment}
              width="50px"
              height="50px"
              alt="image"
              title="image"
            />
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatFactory;
