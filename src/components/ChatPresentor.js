// Chat.js
import React, { useState } from "react";
import { dbService, storageService } from "firebasePack";

const ChatPresentor = ({ chatObj, isOwner }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newChat, setNewChat] = useState(chatObj.text);

  const toggleEditClick = () => setIsEdit(true);

  const onChange = ({ target: { value } }) => {
    setNewChat(value);
  };

  const onUpdateChat = async (event) => {
    event.preventDefault();
    await dbService.doc(`chats/${chatObj.id}`).update({ text: newChat });
    setIsEdit(false);
  };

  const onDeleteClick = async () => {
    const isOkay = window.confirm("Are you sure you want to delete this chat?");
    if (isOkay) {
      await dbService.doc(`chats/${chatObj.id}`).delete();
      if (chatObj.attachmentUrl !== "") {
        // firebase 버킷에서 해당 URL과 일치하는 ref를 찾아서 지운다.
        await storageService.refFromURL(chatObj.attachmentUrl).delete();
      }
    }
  };

  return (
    <div>
      {isEdit ? (
        <form onSubmit={onUpdateChat}>
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
          {chatObj.attachmentUrl !== "" && (
            <img
              src={chatObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="image"
              title="image"
            />
          )}
        </>
      )}
      {isOwner && (
        <>
          <button onClick={toggleEditClick}>Edit</button>
          <button onClick={onDeleteClick}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ChatPresentor;
