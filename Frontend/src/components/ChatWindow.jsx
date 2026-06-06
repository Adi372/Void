import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { socket } from '../utils/socket';

const ChatWindow = () => {

  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [myMessage, setMyMessage] = useState('');
  const { id } = useParams();

  function me(){
      axios.get('http://localhost:3000/api/auth/findUser',
          {
              withCredentials: true
          }
      )
      .then((res)=>{
          setUser(res.data);
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
  }

  function myChat(){
      axios.get('http://localhost:3000/api/chat/allChats', 
          {
              withCredentials: true
          }
      )
      .then((res)=>{
          console.log(res.data);
          const myChat = res.data.chats.find(chat=>
            chat._id === id
          )
          console.log("my chat:",myChat)
          setChat(myChat);
      })
      .catch((err)=>{
          console.log(err);
      })
  }

  function loadMessages(chatId){
    axios.post('http://localhost:3000/api/chat/loadMessages',
      {chatId},
      {withCredentials: true}
    )
    .then((res)=>{
      console.log(res.data);
      const formatted = res.data.messages.map((msg)=>({
          id: msg._id.toString(),
          senderId: msg.sender,
          sender: msg.sender === user._id? "me":"friend",
          message: msg.text,
          senderPic: msg.senderPic
        }));
        setMessages(formatted);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  useEffect(()=>{
      me();
  }, []);

  useEffect(()=>{
    myChat();
  }, [id]);

  useEffect(()=>{
    if(user){
      loadMessages(id);
    }
  }, [user, id]);

  useEffect(() => {
    if(id){
      socket.emit("join-chat", id);
      console.log("chat opened");
    }
  }, [id]);

  useEffect(()=>{
  
   const handler = (data) => {
    console.log("received socket event:", data);
    if (data.chatId.toString() !== id) return;
     console.log(data);
      const msg = {
        id: data._id,
        sender: data.sender === user._id ? "me" : "friend",
        senderId: data.sender === user._id ? user._id : chat.friendId,
        senderPic: data.sender === user._id ? user.profilePic : chat.friendPic,
        message: data.text
      };
     setMessages((prev)=>[...prev, msg]);
   }
  
   socket.on("receive-message", handler);
   return () => {
     socket.off("receive-message", handler);
   };
  }, [user, id]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!myMessage.trim()) return;
    let data = {
      chatId: id,
      text: myMessage,
      participants: [user._id, chat.friendId]
    }
    socket.emit("send-message", data);
    setMyMessage("");
  }

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='border w-full h-[12%] flex items-center px-5 gap-4'>
        <Link to={`/userProfile/${chat?.friendId}`} className="border h-10 w-10 rounded-full overflow-hidden cursor-pointer">
            {!chat?.friendPic ? (
            <div className="h-full w-full flex items-center justify-center text-2xl">
                <i className="ri-user-line"></i>
            </div>
            ) : (
            <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                <img
                    src={chat.friendPic}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                />
            </div>
            )}
        </Link>
        <Link to={`/userProfile/${chat?.friendId}`} className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>{chat?.friendFullName?.firstName} {chat?.friendFullName?.lastName}</h1>
            <h1 className='text-sm'>{chat?.friendUsername}</h1>
        </Link>
      </div>

      <div className='border h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        {
          messages.map((msg)=>(
            <div key={msg.id} className={`flex gap-3 items-center w-fit max-w-[93%] break-all ${msg.sender === 'me'?'self-end flex-row-reverse':''}`}>
              <Link to={`/userProfile/${msg?.senderId}`} className="border h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                  {!msg?.senderPic ? (
                  <div className="h-full w-full flex items-center justify-center text-2xl">
                      <i className="ri-user-line"></i>
                  </div>
                  ) : (
                  <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                      <img
                          src={msg.senderPic}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                      />
                  </div>
                  )}
              </Link>
              <div className='border px-2 py-1 rounded h-fit w-fit'>
                {msg.message}
              </div>
            </div>
          ))
        }
      </div>

      <form onSubmit={handleSubmit} className='border h-[12%] flex items-center px-5 gap-2'>
        <input value={myMessage} onChange={(e)=>setMyMessage(e.target.value)} className='border rounded w-[93%] h-12 py-2 px-3' placeholder='Message...' type="text" />
        <button type='submit' className='border flex items-center h-12 text-2xl w-[7%] rounded justify-center'><i class="ri-send-plane-2-line"></i></button>
      </form>
    </div>
  )
}

export default ChatWindow
