import { post } from '../Http'
import { StreamChat } from 'stream-chat';
import { EThree, IdentityAlreadyExistsError, LookupError } from '@virgilsecurity/e3kit';
import React, { PureComponent } from 'react';

export class StartChat extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      receiver: '',
      sender: props.user.nickname,
      stream: null,
      virgil: null,
      error: null,
    }

    console.log("user", props.user);
  };

  // old Function used to set sender name
  // _handlesenderChange = (event) => {
  //   this.setState({ sender: event.target.value });
  // };

  _handlereceiverChange = (event) => {
    this.setState({ receiver: event.target.value });
  };

  _handleRegister = (event) => {
    event.preventDefault();
    
    const user_id = this.state.user.sub.replace('auth0|','auth0-');
    console.log(user_id);

    post("http://localhost:9000/authenticate", { sender: user_id })
      .then(res => res.authToken)
      .then(this._connect);
  };

  _handleStartChat = async (event) => {
    event.preventDefault();

    try {
      const user_id = this.state.user.sub.replace('auth0|','auth0-'); 

      // it is going to contains the names for both sender and reciever
      let members = [this.state.sender, this.state.receiver];

      // it is going to contains the ids for both sender and reciever
      let memberids = [user_id, this.state.receiver];   

      members.sort();
      memberids.sort();

      const messageid = memberids.join('_');

      const channel = this.state.stream.client.channel('messaging', messageid, {
        image: `https://getstream.io/random_svg/?id=rapid-recipe-0&name=${members.join("+")}`,
        name: members.join(", ")
      });

      const publicKeys = await this.state.virgil.eThree.lookupPublicKeys([user_id, this.state.receiver]);
      
      this.props.onConnect({
        sender: user_id,
        receiver: this.state.receiver,
        stream: { ...this.state.stream, channel },
        virgil: { ...this.state.virgil, publicKeys }
      });

    } catch (err) {
      if (err instanceof LookupError) {
        this.setState({ error: 'Other user is not registered. Open another window and register that user.' })
      } else {
        this.setState({ error: err.message });
      }
    }
  };

  _connectStream = async (backendAuthToken) => {
    const response = await post("http://localhost:9000/stream-credentials", { name: this.state.sender }, backendAuthToken);

    const client = new StreamChat(response.apiKey);
    client.setUser(response.user, response.token);

    return { ...response, client };
  };

  _connectVirgil = async (backendAuthToken) => {
    const response = await post("http://localhost:9000/virgil-credentials", {}, backendAuthToken);
    const eThree = await EThree.initialize(() => response.token);
    try {
      await eThree.register();
    } catch (err) {
      if (err instanceof IdentityAlreadyExistsError) {
        // already registered, ignore
      } else {
        this.setState({ error: err.message });
      }
    }

    return { ...response, eThree };
  };

  _connect = async (authToken) => {
    const stream = await this._connectStream(authToken);
    const virgil = await this._connectVirgil(authToken);

    this.setState({ stream, virgil })
  };

  render() {
    let form;
    if (this.state.virgil && this.state.stream) {
      form = {
        field: 'receiver',
        title: 'Who do you want to chat with?',
        subtitle: 'Registered as "' + this.state.sender + '". Open this app in another window to register another user, or type a previously registered username below to start a chat.',
        submitLabel: 'Start Chat',
        submit: this._handleStartChat,
        handleFieldChange: this._handlereceiverChange
      }
    } else {
      return (
        <div className="container">
          <form className="card" onSubmit={this._handleRegister}>
            <div className="subtitle">
              <label htmlFor="sender">Continue as {this.state.sender}</label>
            </div>
            <input type="submit" value="Continue"/>
            <div className="error">{this.state.error}</div>
          </form>
        </div>
      )
    }

    return (
      <div className="container">
        <form className="card" onSubmit={form.submit}>
          <label htmlFor={form.field}>{form.title}</label>
          <div className='subtitle'>{form.subtitle}</div>
          <input id="sender" type="text" name={form.field} value={this.state[form.field]}
                 onChange={form.handleFieldChange}/>
          <input type="submit" value={form.submitLabel}/>
          <div className="error">{this.state.error}</div>
        </form>
      </div>
    )
  }
}
