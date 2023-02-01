import React, { useEffect, useState } from "react";
import ChatContainer from "../../components/ChatContainer";
import Contacts from "../../components/Contacts";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchUsers } from "../../slices/userSlice";
import Welcome from "../../components/Welcome";

const Chat = () => {
  const { contacts, user } = useSelector((store) => store.user);
  const [currentChat, setCurrentChat] = useState(undefined);
  const dispatch = useDispatch();

    useEffect(() => {
    if(user){
    dispatch(fetchUser())
    }

  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers());
    console.log(contacts);
  }, [dispatch]);
  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            key={Math.random()}
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
            currentUser={user}
          />
          {currentChat === undefined ? (
            <Welcome               currentUser={user}
            />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              currentUser={user}
              //   socket={socket}
              key={Math.random()}
            />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: -webkit-fill-available;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #0e0e11;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 20% 80%;
    @media screen and (min-width: 720px) {
      grid-template-columns: 35% 65%;
      grid-template-rows: none;
      width: 85vw;
      height: 100vh;
    }
    @media screen and (min-width: 1100px) {
      grid-template-columns: 28% 72%;
    }
  }
`;

export default Chat;
