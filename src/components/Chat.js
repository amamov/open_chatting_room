import React, { useState } from "react";
import { dbService } from "firebasePack";

const Chat = ({ chatObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newChat, setNewChat] = useState(chatObj.text);

  const onDeleteClick = async () => {
    const isOkay = window.confirm("Are you sure you want to delete this chat?");

    if (isOkay) {
      // 삭제
      await dbService.doc(`chats/${chatObj.id}`).delete();
    } else {
      // 실행 취소
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();

    await dbService.doc(`chats/${chatObj.id}`).update({
      text: newChat,
    });
    setIsEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewChat(value);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              required
              value={newChat}
              onChange={onChange}
              placeholder="Edit your chat."
            />
            <input type="submit" value="Update new chat" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <h4>{chatObj.text}</h4>
      )}
      {isOwner && (
        <>
          <button onClick={onDeleteClick}>Delete Chat</button>
          <button onClick={toggleEditing}>Edit Chat</button>
        </>
      )}
    </div>
  );
};

export default Chat;
