import React, { useEffect, useRef, useState } from "react";
import loading from "../../assets/images/loader.gif";
import styled from "styled-components";
import Logout from "../Logout";
import ChatInput from "../ChatInput";
import defaultAvatar from "../../assets/images/DefaultAvatar.png";
import { getMessages } from "../../slices/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";

const ChatContainer = ({ currentChat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  // const { status } = useSelector((state) => state.message);
  const [isLoading, setIsLoading] = useState(false);
  const [pusher, setPusher] = useState(null);

  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // how use pusher events messages of chat reactjs?

  useEffect(() => {
    const pusher = new Pusher("a21862e89aa46d70865d", {
      cluster: "eu",
      encrypted: true,
    });
    setPusher(pusher);
  }, []);

  useEffect(() => {
    const getMsg = async () => {
      if (currentChat && currentUser) {
        await dispatch(getMessages(currentChat.id)).then((data) => {
          console.log(data);
          setMessages(data.payload);
        });
      }
    };
    getMsg();

    if (pusher) {
      const channel = pusher.subscribe("chat-channel");
      channel.bind("new-message", (data) => {
        getMsg();
      });
    }

    //
  }, [currentChat, currentUser, dispatch, pusher]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={currentChat?.avatarImage || defaultAvatar}
              alt="current Chat avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat?.name}</h3>
          </div>
        </div>
        <Logout />
      </div>
      {isLoading === "loading" ? (
        <div className="loading-messages">
          <img src={loading} alt="loader" className="loader" />
        </div>
      ) : (
        <div className="chat-messages">
          sds
          {messages?.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.user_id === currentUser.id ? "sended" : "recieved"
                  }`}
                >
                  {message.message && (
                    <div className="content ">
                      <p>{message.message}</p>
                    </div>
                  )}
                  {message.image && (
                    <div className="content-image">
                      <img src={message.image} alt="sended" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ChatInput currentChat={currentChat} currentUser={currentUser} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  /* gap: 0.1rem; */
  overflow: hidden;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid #ffffff15;
    -webkit-box-shadow: 0px 17px 20px -26px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 17px 20px -26px rgba(66, 68, 90, 1);
    box-shadow: 0px 17px 20px -26px rgba(66, 68, 90, 1);
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3.1rem;
        }
      }
      .username {
        h3 {
          color: #e4e6eb;
        }
      }
    }
    @media screen and (min-width: 720px) {
      .avatar {
        img {
          height: 3rem;
        }
      }
    }
  }
  .loading-messages {
    text-align: center;
    margin-top: 35vh;
    img {
      width: 120px;
      height: 120px;
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 70%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 0.9rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) {
          max-width: 50%;
          font-size: 1.1rem;
        }
      }
      .content-image {
        max-width: 70%;
        /* justify-self: flex-end; */
        img {
          max-width: 300px;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: rgb(255, 82, 161);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: rgb(0, 135, 255);
      }
    }
  }
  @media screen and (max-width: 900px) and (orientation: landscape) {
    grid-template-rows: 15% 70% 15%;
    .chat-header {
      .user-details {
        .avatar {
          img {
            height: 2.6rem;
          }
        }
      }
    }
  }
`;

export default ChatContainer;
