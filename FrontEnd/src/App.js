// src/App.js

import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import {EncryptedChat} from "./components/EncryptedChat";
import './App.css';


function App() {
 
  const { loading, user, loginWithRedirect} = useAuth0();

  // this function create socail network link to share user page
  const createLink = (methods, user_id) => {
    // the application url
    const appurl = 'http://localhost:3000';
    // link to share the user chat page (comunicate with the registerate user)
    const usrl = `https://api.addthis.com/oexchange/0.8/forward/${methods}/offer?url=${appurl}/?id=${user_id}&pubid=ra-42fed1e187bae420&title=Chat%20Me&ct=1`
    return usrl;
  }

  
  if (loading) {
    return <div>Loading...</div>;
  }
  if(!user)
  return <div>{!user && loginWithRedirect({})}</div>;
  else{
    const user_id = user.sub.replace('auth0|', 'auth0-');
    return (
      <div>
        <header>
          <NavBar />
        </header>

        <div className="socialLink">
          <a href={createLink("facebook", user_id)} target="_blank" rel="noopener noreferrer">
            <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/facebook.png" border="0" alt="Facebook" />
          </a>

          <a href={createLink("messenger", user_id)} target="_blank" rel="noopener noreferrer">
            <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/messenger.png" border="0" alt="Facebook Messenger" />
          </a>

          <a href={createLink("whatsapp", user_id)} target="_blank" rel="noopener noreferrer">
            <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/whatsapp.png" border="0" alt="WhatsApp" />
          </a>

          <a href={createLink("twitter", user_id)} target="_blank" rel="noopener noreferrer">
            <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/twitter.png" border="0" alt="Twitter" />
          </a>
        </div>

        <EncryptedChat user={user}/>
      </div>
    );
  }
}

export default App;
