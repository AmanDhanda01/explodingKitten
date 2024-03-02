import React from 'react'
import { useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCards,emptyCards,remove} from "../slices/cardSlice";
import {toast} from "react-hot-toast";
import { fetchAllUser, fetchUser, updateScore } from '../api/api';


export default function GameScreen({username}) {
    const state = useSelector((state) =>state.card);
    const [cards,setCards] = useState();
    const [user,setUser] = useState(null);
    const [allUser,setAllUser] = useState();
    const [hasDefuse,setHasDefuse] = useState(0);
    const dispatch = useDispatch();
    const [isStart,setIsStart] = useState(false);
    const [score,setScore] = useState(0);
    const [clickedCard,setClickedCard] = useState();

    useEffect(() =>{
      async function init(){
         const User =  await fetchUser(username);
         const AllUser = await fetchAllUser();
         setUser(User)
         setScore(User.score);
         setAllUser(AllUser)
      }
      init();

    },[]);
    useEffect(() =>{
      setCards(state);
    },[state])


 async function Handler(index){
   
   setClickedCard(index);
   setTimeout(async () =>{
      if(cards.length===1 && (cards[index].name==="Cat card" || cards[index].name==="Defuse card" ||(hasDefuse>0 && cards[index].name==="Exploding kitten card"))){
         setScore(prev =>prev+1);
         setIsStart(false);
         setHasDefuse(0);
         dispatch(emptyCards());
         await updateScore(user.username,score+1);
         const AllUser = await fetchAllUser();
         setAllUser(AllUser)
         toast.success("You won");
    }else if(cards[index].name==="Cat card"){
          dispatch(remove(index));
    }else if(cards[index].name==="Defuse card"){
           dispatch(remove(index));
           setHasDefuse(prev => prev+1);
    }else if(cards[index].name==="Shuffle card"){ 
           dispatch(emptyCards());
           dispatch(getCards());
           setHasDefuse(0);
    }else if(cards[index].name==="Exploding kitten card"){
       if(hasDefuse > 0){
          dispatch(remove(index));
          setHasDefuse(prev => prev-1);
          setClickedCard(null);
          return;
       }
       toast.error("You Lost");
       setIsStart(false);
       dispatch(emptyCards());
    }
    setClickedCard(null);
   },1000)
  
   
        
        
        
  
        
    }
   //  console.log
  
  
  

    return (
      <div className="min-w-screen min-h-screen bg-black flex flex-col items-center space-y-7 p-5 relative">
                 {/* LeaderBoard */}
                 <div className='absolute right-10 w-52 h-44 outline outline-1 text-white rounded-lg p-2 '>
                      <h1 className='text-center font-semibold text-lg'>Leaderboard</h1>
                      <hr/>
                      <div className='overflow-y-auto h-[90%]'>
                         {allUser && allUser.sort((a,b) => b.score-a.score).map((player,index) =>(
                                <div key={index} className='flex items-center justify-evenly'>
                                      <p className='w-[10%] text-center'>{index+1}.</p>
                                      <p className='w-[30%] text-center'>{player.username}</p>
                                      <p className='flex-1 text-center'>{player.score}</p>
                                </div>
                         ))}
                      </div>  
                 </div>

                 {/* Game Section */}
                <p className ="text-green-500 font-semibold text-2xl">Hello  {user?.username}</p>
               <p className="text-white font-semibold text-lg">Score :{score}</p>
              <button className={`p-4 w-28 h-10 rounded-md flex items-center justify-center ${isStart ? "bg-red-600":"bg-green-600"}  text-white `} onClick={() => {
                   if(isStart){
                        dispatch(emptyCards());
                     }else{
                        dispatch(getCards());
                      }
                   setIsStart(!isStart)
  
              }}>{isStart ? "Close":"Start"}</button>
  
              <div className="mx-auto w-full max-w-5xl h-50 flex flex-col justify-center items-center">
                        <div className="flex items-center space-x-5 ">
                           {cards && cards.map((card,index) =>(
                              <>
                              <div  key={index} onClick={() => Handler(index)}  className="text-center z-10  cursor-pointer relative rounded-lg">
                                 <img src={card.logo} height={500} width={150} alt="card"/>
                                 <span className="text-white font-medium ">{card.name}</span>
                                 {clickedCard !== index && (
                                          <div className="absolute top-0 left-0 w-full h-full bg-green-500  rounded-lg" />
                                 )}
                                  
                               </div>
                              </>

  
                               
  
                         
  
  
                           ))}
                        </div>
              </div>
  
      </div>
  
    );
}

// export default GameScreen
