// Chat.js
import React, { useState } from "react";
import { dbService, storageService } from "firebasePack";

const Chat = ({ chatObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newChat, setNewChat] = useState(chatObj.text);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewChat(value);
  };

  const updateChat = async (event) => {
    event.preventDefault();
    await dbService.doc(`chats/${chatObj.id}`).update({ text: newChat });
    setIsEditing(false);
  };

  const onDeleteClick = async () => {
    const isOkay = window.confirm("Are you sure you want to delete this chat?");

    if (isOkay) {
      // 삭제
      await dbService.doc(`chats/${chatObj.id}`).delete();

      if (chatObj.attachmentUrl !== "") {
        // firebase의 버킷에서 해당 url로 ref를 찾아서 사진을 지운다.
        await storageService.refFromURL(chatObj.attachmentUrl).delete();
      }
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={updateChat}>
          <input
            type="text"
            value={newChat}
            onChange={onChange}
            placeholder="Edit your chat."
          />
          <input type="submit" value="Update new chat." />
        </form>
      ) : (
        <>
          <h4>{chatObj.text}</h4>
          {chatObj.attachmentUrl && (
            <img src={chatObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete chat</button>
              <button onClick={toggleEditing}>Edit chat</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
