import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Feed from './Feed';
import { socket } from '../utils/socket';

const UserProfile = () => {

    const [me, setMe] = useState(null);
    const [user, setUser] = useState(null);
    const {userId} = useParams();
    const [posts, setPosts] = useState([]);
    const [requestStatus, setRequestStatus] = useState("");

    const navigate = useNavigate();


    function searchMe(userId){
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            setMe(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setMe(null);
        });
    }

    function searchUser(userId){
        axios.post('http://localhost:3000/api/user/searchOneUser',
            {
               userId 
            },
          {
              withCredentials: true
          }
      )
      .then((res)=>{
        console.log(res.data.user)
          setUser(res.data.user);
      })
      .catch((err)=>{
          console.log(err);
      });
    }

    function checkStatus(){
        if (!me || !user) return;
        let checkSent = me.sentRequest.find(id=>
            id.toString() === user._id.toString()
        )
        if(checkSent){
            setRequestStatus("sent")
            return;
        }

        let checkReceived = me.receivedRequest.find((id)=>
            id.toString() === user._id.toString()
        )
        if(checkReceived){
            setRequestStatus("received");
            return;
        }
        let checkAccepted = me.friends.find((id)=>
            id.toString() === user._id.toString()
        )
        if(checkAccepted){
            setRequestStatus("accepted");
            return
        }
        setRequestStatus("unsent")
    }

    function getPosts(userId){
        axios.post('http://localhost:3000/api/post/userPosts',
            {
                userId
            },
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data.posts);
            setPosts(res.data.posts)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        searchUser(userId);
    }, []);

    useEffect(()=>{
        searchMe(userId);
    }, []);

    useEffect(()=>{
        getPosts(userId);
    },[]);

    useEffect(()=>{
        checkStatus();
    }, [me, user]);

    function sendFriendRequest(user2Id){
        axios.post('http://localhost:3000/api/user/sendFriendRequest',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setRequestStatus(res.data.status);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    if (!user || !me) {
        return <div className='h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>;
    }


    function unsendFriendRequest(user2Id){
        if(requestStatus === "unsent" || requestStatus === ""){
            return;
        }
        axios.post('http://localhost:3000/api/user/unsendFriendRequest',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setRequestStatus(res.data.status);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function acceptFriendRequest(user2Id){
        if(requestStatus === "unsent" || requestStatus === "sent"){
            return;
        }
        axios.post('http://localhost:3000/api/user/acceptFriendRequest',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setRequestStatus(res.data.status);
            setMe(prev => ({
            ...prev,
            receivedRequest: prev.receivedRequest.filter(
                id => id.toString() !== user2Id.toString()
            ),
            friends: [...prev.friends, user2Id]
        }));

            setUser(prev => ({
                ...prev,
                sentRequest: prev.sentRequest.filter(
                    id => id.toString() !== me._id.toString()
                ),
                friends: [...prev.friends, me._id]
            }));
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function rejectFriendRequest(user2Id){
        if(requestStatus === "unsent" || requestStatus === "sent"){
            return;
        }
        axios.post('http://localhost:3000/api/user/rejectFriendRequest',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setRequestStatus(res.data.status);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function removeFriend(user2Id){
        if(requestStatus === "unsent" || requestStatus === "sent"){
            return;
        }
        axios.post('http://localhost:3000/api/user/removeFriend',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setRequestStatus(res.data.status);

            setRequestStatus("unsent");

            setMe(prev => ({
                ...prev,
                friends: prev.friends.filter(
                    id => id.toString() !== user2Id.toString()
                )
            }));

            setUser(prev => ({
                ...prev,
                friends: prev.friends.filter(
                    id => id.toString() !== me._id.toString()
                )
            }));
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    console.log(requestStatus)
    console.log(me)

    function openChat(user2Id){
        axios.post('http://localhost:3000/api/chat/findOrCreate',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            socket.emit("join-chat", res.data.chatId);
            navigate(`/chat/${res.data.chatId}`)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

  return (
    <div className='h-screen overflow-y-auto hide-scrollbar'>
        <div className='w-full flex flex-col'>
            <div className='flex pt-15 pb-10 gap-10 px-5 w-full justify-center'>
                <label onClick={() => navigate(`/userProfile/${post.user}`)} className="h-40 w-40 rounded-full overflow-hidden cursor-pointer">
                    {!user.profilePic ? (
                    <div className="h-full w-full flex items-center justify-center text-[170px]">
                        <i className="ri-user-line"></i>
                    </div>
                    ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-[160px]">
                        <img
                            src={user.profilePic}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    )}
                </label>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-4xl font-bold'>{user.username}</h1>
                    <h1 className='text-xl font-semibold'>{`${user.fullName.firstName} ${user.fullName.lastName}`}</h1>
                    <div className='flex gap-5'>
                        <h1 className='text-xl font-semibold'>{`${user.createdPosts.length} posts`}</h1>
                        <h1 className='text-xl font-semibold'>{`${user.friends.length} friends`}</h1>
                    </div>
                </div>
            </div>
            <div className=' items-center h-15 flex justify-center gap-10'>
                <div className={`${requestStatus === "unsent"? "block":"hidden"}`}>
                    <button onClick={() =>sendFriendRequest(user._id)} className='border rounded h-fit w-fit py-2 px-3'>
                        Add Friend
                    </button>
                </div>
                <div className={`${requestStatus === "sent"? "block":"hidden"}`}>
                    <button onClick={() =>unsendFriendRequest(user._id)} className='border rounded h-fit w-fit py-2 px-3'>
                        Cancel Request
                    </button>
                </div>
                <div className={`${requestStatus === "received"? "flex":"hidden"} flex gap-2`}>
                    <button onClick={() =>acceptFriendRequest(user._id)} className={`border rounded h-fit w-fit py-2 px-3`}>
                        Accept
                    </button>
                    <button onClick={() =>rejectFriendRequest(user._id)} className={`border rounded h-fit w-fit py-2 px-3`}>
                        Reject
                    </button>
                </div>
                <div className={`${requestStatus === "accepted"? "flex":"hidden"} flex gap-2`}>
                    <button onClick={() =>removeFriend(user._id)} className={`border rounded h-fit w-fit py-2 px-3`}>
                        Remove Friend
                    </button>
                </div>
                <button onClick={(()=>openChat(user._id))} className={` ${requestStatus === "accepted"? "flex":"hidden"} border rounded h-fit w-fit py-2 px-3`}>
                    Message
                </button>
            </div>
            <div className=' mt-10 px-15'>
                <div className='flex flex-wrap py-3 justify-between gap-y-10'>
                    {
                        posts.map((post, index)=>(
                            <Feed key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile
