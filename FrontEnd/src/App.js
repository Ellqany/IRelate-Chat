// src/App.js

import React from "react";
import { Router, Switch } from "react-router-dom";

import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import {EncryptedChat} from "./components/EncryptedChat";
import history from "./utils/history";

import './App.css';
import PrivateRoute from "./components/PrivateRoute";


function App() {
 
  const { loading } = useAuth0();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router history={history}>
        <header>
          <NavBar />
        </header>

        <Switch>
          <PrivateRoute path="/" component={EncryptedChat}>
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
