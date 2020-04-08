// src/App.js

import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import {EncryptedChat} from "./components/EncryptedChat";


function App() {
 
  const { loading, user, loginWithRedirect} = useAuth0();

  
  if (loading) {
    return <div>Loading...</div>;
  }
  if(!user)
  return <div className="App">{!user && loginWithRedirect({})}</div>;
  else
  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      <EncryptedChat user={user}/>
    </div>
  );
}

export default App;
