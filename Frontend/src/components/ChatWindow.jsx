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
      console.log(res.data.messages);
      const formatted = res.data.messages.map((msg)=>({
          id: msg._id.toString(),
          senderId: msg.sender._id,
          sender: msg.sender._id.toString() === user._id.toString()? "me":"friend",
          message: msg.text,
          senderPic: msg.sender.profilePic
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
  if (!id) return;

    const joinRoom = () => {
      socket.emit("join-chat", id);
      console.log("Joined room:", id);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [id]);

  useEffect(() => {
    const handler = (data) => {
      console.log("received socket event:", data);
      if (data.chatId.toString() !== id) return;

      // Determine who sent the message using ONLY the incoming data
      const isMine = data.sender === user._id;
      const senderId = isMine ? user._id : data.sender;            // `data.sender` is the friend's ID
      const senderPic = isMine
        ? user?.profilePic
        : (data.senderPic || null);                                // server may include friend's pic

      const msg = {
        id: data._id,
        sender: isMine ? "me" : "friend",
        senderId,
        senderPic,
        message: data.text,
      };
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [user, id, chat]);   // added `chat` only if you still need it elsewhere

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!myMessage.trim() || !chat) return;   // don't send if chat not loaded
    let data = {
      chatId: id,
      text: myMessage,
      participants: [user._id, chat.friendId],
    };
    socket.emit("send-message", data);
    setMyMessage("");
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <div className=' w-full h-[12%] flex items-center px-5 gap-4'>
        <Link to={`/userProfile/${chat?.friendId}`} className=" h-10 w-10 rounded-full overflow-hidden cursor-pointer">
            {!chat?.friendPic ? (
            <div className="text-white h-full w-full flex items-center justify-center text-2xl">
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
        <Link to={`/userProfile/${chat?.friendId}`} className='text-white flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>{chat?.friendFullName?.firstName} {chat?.friendFullName?.lastName}</h1>
            <h1 className='text-sm'>{chat?.friendUsername}</h1>
        </Link>
      </div>

      <div className='border-y-2 text-white border-[#373A43] h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        {
          messages.map((msg)=>{
            console.log(msg)
            return (
            <div key={msg.id} className={`flex gap-3 items-center w-fit max-w-[93%] break-all ${msg.sender === 'me'?'self-end flex-row-reverse':''}`}>
              {/* <Link to={`/userProfile/${msg?.senderId}`} className=" h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                  {!msg?.senderPic ? (
                  <div className=" h-full w-full flex items-center justify-center text-2xl">
                      <i className="ri-user-line"></i>
                  </div>
                  ) : (
                  <div className="hover:border-white hover:border-2 h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                      <img
                          src={msg.senderPic}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                      />
                  </div>
                  )}
              </Link> */}
              <div className={` ${msg.sender === 'me'?'bg-[#181A20]':'bg-[#1F2128]'} px-3 py-2 rounded-md h-fit w-fit`}>
                {msg.message}
              </div>
            </div>
          )})
        }
      </div>

      <form onSubmit={handleSubmit} className=' h-[12%] flex items-center px-5 gap-2'>
        <input value={myMessage} onChange={(e)=>setMyMessage(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded w-[93%] h-12 py-2 px-3' placeholder='Message...' type="text" />
        <button type='submit' className='text-[#808191] hover:text-white flex items-center h-12 text-2xl w-[7%] rounded justify-center'><i class="ri-send-plane-2-line"></i></button>
      </form>
    </div>
  )
}

export default ChatWindow
