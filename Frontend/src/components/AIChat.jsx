import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {socket} from '../utils/socket';

const AIChat = () => {

  const [user, setUser] = useState(null);
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);

  const [userMessage, setUserMessage] = useState('');

  useEffect(()=>{
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
          console.log("user fetched")
            setUser(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setUser(null);
        });
    }, []);

    useEffect(()=>{
      axios.get('http://localhost:3000/api/aiChat/findOrCreate',
        {
          withCredentials: true
        }
      )
      .then((res)=>{
        console.log("chat opened")
        socket.emit("join-aiChat", res.data.chatId);
        console.log(res.data);
        setChatId(res.data.chatId);
      })
      .catch((err)=>{
        console.log(err);
      })
    }, []);

    useEffect(()=>{
      if(!chatId) {
        console.log("chatId not loaded yet")
        return;
      }
      axios.post('http://localhost:3000/api/aiChat/loadAIMessages',
        {
          chatId
        },
        {
          withCredentials: true
        }
      )
      .then((res)=>{
        console.log("messages loaded")
        const formatted = res.data.messages.map((msg)=>({
          id: msg._id.toString(),
          sender: msg.role === "user"? "user":"assistant",
          message: msg.content
        }));
        setMessages(formatted);
      })
      .catch((err)=>{
        console.log(err);
      })
    }, [chatId]);

    console.log(messages);


    useEffect(()=>{

      const handler = (data) => {
        console.log(data);
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

    if(!user){
        return <div className='h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>
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
      console.log("message submited")
      setMessages((prev)=>[...prev, msg]);
      setUserMessage("");
    }

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='border w-full h-[12%] flex items-center px-5 gap-4'>
        <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
          <i class="ri-user-line"></i>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>AI</h1>
        </div>
      </div>

      <div className='border h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        {
          messages.map((msg)=>(

            <div key={msg.id} className={`flex gap-3 items-center w-fit max-w-[45%] break-all ${msg.sender === 'user'?'self-end flex-row-reverse':''}`}>
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
        <input value={userMessage} onChange={(e)=>setUserMessage(e.target.value)} className='border rounded w-[93%] h-12 py-2 px-3' placeholder='Message...' type="text" />
        <button type='submit' className='border flex items-center h-12 text-2xl w-[7%] rounded justify-center'><i class="ri-send-plane-2-line"></i></button>
      </form>
    </div>
  )
}

export default AIChat
