import { MessageEncrypted } from './MessageEncrypted';
import { MessageInputEncrypted } from "./MessageInputEncrypted";
import React from 'react';
import { StartChat } from "./StartChat";
import { Channel, ChannelHeader, Chat, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

export class EncryptedChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: props.user,
      receiver: null,
      stream: null,
      virgil: null
    };  
  }

  _buildMessageEncrypted = (props) => {
    const newProps = {
      ...props,
      sender: this.state.sender,
      receiver: this.state.receiver,
      virgil: this.state.virgil
    };
    return <MessageEncrypted {...newProps}/>
  };

  onConnect = (chatData) => {
    this.setState(chatData);
  };

  render = () => {
    if (this.state.stream && this.state.virgil) {
      return (
        <Chat client={this.state.stream.client} theme={'messaging light'}>
          <Channel channel={this.state.stream.channel}>
            <Window>
              <ChannelHeader/>
              <MessageList Message={this._buildMessageEncrypted}/>
              <MessageInputEncrypted virgil={this.state.virgil} channel={this.state.stream.channel}/>
            </Window>
            <Thread/>
          </Channel>
        </Chat>
      )
    } else {
      return <StartChat user={this.state.sender} onConnect={this.onConnect}/>
    }
  }
}

 