import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
          sender: msg.sender === user._id? "me":"friend",
          message: msg.text
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
        <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
          <i class="ri-user-line"></i>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>{chat?.friendFullName?.firstName} {chat?.friendFullName?.lastName}</h1>
            <h1 className='text-sm'>{chat?.friendUsername}</h1>
        </div>
      </div>

      <div className='border h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        {
          messages.map((msg)=>(
            <div key={msg.id} className={`flex gap-3 items-center w-fit max-w-[93%] break-all ${msg.sender === 'me'?'self-end flex-row-reverse':''}`}>
              <div className='border h-10 w-10 rounded-full flex justify-center items-center self-start shrink-0'>
                <i class="ri-user-line"></i>
              </div>
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
