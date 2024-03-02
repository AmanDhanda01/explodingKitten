import React from "react";
import { useState } from "react";
import EnterUser from "./components/EnterUser";
import GameScreen from "./components/GameScreen";

function App() {

  const [username,setUsername] = useState(null);

  return (
    <>
               {!username && <EnterUser setUsername={setUsername}/>} 
               {username && <GameScreen username={username}/>}
    </>

   
  );
}

export default App;
