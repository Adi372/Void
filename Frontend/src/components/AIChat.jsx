import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import {socket} from '../utils/socket';
import gsap from 'gsap';

const AIChat = () => {

  const messagesContainerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);

  const [userMessage, setUserMessage] = useState('');

  useEffect(()=>{
        axios.get('https://void-tup9.onrender.com/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
          // console.log("user fetched")
          // console.log(res.data)
            setUser(res.data);
        })
        .catch((err)=>{
            // console.log(err);
            setUser(null);
        });
    }, []);

    useEffect(()=>{
      axios.get('https://void-tup9.onrender.com/api/aiChat/findOrCreate',
        {
          withCredentials: true
        }
      )
      .then((res)=>{
        // console.log("chat opened")
        socket.emit("join-aiChat", res.data.chatId);
        // console.log(res.data);
        setChatId(res.data.chatId);
      })
      .catch((err)=>{
        // console.log(err);
      })
    }, []);

    useEffect(()=>{
      if(!chatId) {
        // console.log("chatId not loaded yet")
        return;
      }
      axios.post('https://void-tup9.onrender.com/api/aiChat/loadAIMessages',
        {
          chatId
        },
        {
          withCredentials: true
        }
      )
      .then((res)=>{
        // console.log("messages loaded")
        const formatted = res.data.messages.map((msg)=>({
          id: msg._id.toString(),
          sender: msg.role === "user"? "user":"assistant",
          message: msg.content
        }));
        setMessages(formatted);
      })
      .catch((err)=>{
        // console.log(err);
      })
    }, [chatId]);

    // console.log(messages);


    useEffect(()=>{

      const handler = (data) => {
        // console.log(data);
        const msg = {
          id: Date.now(),
          sender: "assistant",
          message: data.content
        }
        setMessages((prev)=>[...prev, msg]);
      }

      socket.on("ai-response", handler);
      return () => {
        socket.off("ai-response", handler);
      };
    }, []);

    useEffect(() => {
      const el = messagesContainerRef.current;
      if (!el) return;

      gsap.to(el, {
        scrollTop: el.scrollHeight,
        duration: 0.5,
        ease: "power2.out"
      });
    }, [messages]);

    if(!user){
        return <div className='text-[#808191] h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

    const handleSubmit = (e)=>{
      if(!userMessage.trim()) return;
      e.preventDefault();
      let data = {
        chatId,
        content: userMessage
      };
      socket.emit("user-response", data);
      let msg = {
        id: Date.now(),
        sender: "user",
        message: userMessage
      }
      // console.log("message submited")
      setMessages((prev)=>[...prev, msg]);
      setUserMessage("");
    }

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='text-white w-full h-[12%] flex items-center px-5 gap-4'>
        <div className='text-2xl border h-12 w-12 rounded-full flex justify-center items-center'>
          <i class="ri-robot-2-line"></i>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>AI</h1>
        </div>
      </div>

      <div ref={messagesContainerRef} className='border-y-2 text-white border-[#373A43] h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        {
          messages.map((msg)=>(

            <div key={msg.id} className={` flex gap-3 items-center w-fit max-w-[45%] break-words ${msg.sender === 'user'?'self-end flex-row-reverse':''}`}>
              <div className={`${msg.sender === 'user'?'hidden':'flex'} border h-10 w-10 rounded-full flex justify-center items-center self-start shrink-0 text-xl`}>
                <i class="ri-robot-2-line"></i>
              </div>
              <div className={` ${msg.sender === 'user'?'flex':'hidden'} h-10 w-10 rounded-full flex items-center justify-center overflow-hidden`}>
                  <img
                      src={user.profilePic}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                  />
              </div>
              <div className={`${msg.sender === 'user'?'bg-[#181A20]':'bg-[#1F2128]'} flex-1 px-3 py-2 rounded h-fit w-fit`}>
                {msg.message}
              </div>
            </div>
          ))
        }
      </div>

      <form onSubmit={handleSubmit} className=' h-[12%] flex items-center px-5 gap-2'>
        <input value={userMessage} onChange={(e)=>setUserMessage(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded w-[93%] h-12 py-2 px-3' placeholder='Message...' type="text" />
        <button type='submit' className=' flex items-center h-12 text-2xl w-[7%] justify-center text-[#808191] hover:text-white'><i class="ri-send-plane-2-line"></i></button>
      </form>
    </div>
  )
}

export default AIChat
