import { post } from '../Http'
import { StreamChat } from 'stream-chat';
import { EThree, IdentityAlreadyExistsError, LookupError } from '@virgilsecurity/e3kit';
import React, { PureComponent } from 'react';

export class StartChat extends PureComponent {
  constructor(props) {
    super(props);

    // get the reciver id from the url link
    const id = (new URLSearchParams(window.location.search)).get("id");

    this.state = {
      user: props.user,
      receiver: id,
      sender: props.user.nickname,
      stream: null,
      virgil: null,
      error: null,
    }

    console.log("user", props.user);
    this._handleRegister();
  };

  // old Function used to set sender name
  // _handlesenderChange = (event) => {
  //   this.setState({ sender: event.target.value });
  // };

  // _handlereceiverChange = (event) => {
  //   this.setState({ receiver: event.target.value });
  // };

  _handleRegister = () => {
    // event.preventDefault();

    // replace | with - because in stream chat id not allowed to contains |
    const user_id = this.state.user.sub.replace('auth0|', 'auth0-');
    console.log('User id: ' + user_id);

    // authenticate user threw backend
    post("http://localhost:9000/authenticate", {
        sender: user_id
      })
      .then(res => res.authToken)
      .then(this._connect);
  };

  _handleStartChat = async () => {
    try {
      // replace | with - because in stream chat id not allowed to contains |
      const user_id = this.state.user.sub.replace('auth0|', 'auth0-');


      // Get user name from auth0
      const Chatusers = await this.state.stream.client.queryUsers({
        id: this.state.receiver
      });

      const Chatuser = Chatusers.users[0];
      const recivername = Chatuser.name;

      // it is going to contains the names for both sender and reciever
      let members = [this.state.sender, recivername];
      members.sort();

      // it is going to contains the ids for both sender and reciever
      let memberids = [user_id, this.state.receiver];
      memberids.sort();

      // Create unique message id for every channel to keep data saved on stream chat
      const messageid = memberids.join('_');

      const channel = this.state.stream.client.channel('messaging', messageid, {
        image: `https://getstream.io/random_svg/?id=rapid-recipe-0&name=${members.join("+")}`,
        name: members.join(", "),
        members: memberids
      });

      // this function used to remove channel data
      // const destroy = await channel.delete();

      // get the public virgil key
      const publicKeys = await this.state.virgil.eThree.lookupPublicKeys([user_id, this.state.receiver]);

      this.props.onConnect({
        sender: user_id,
        receiver: this.state.receiver,
        stream: {
          ...this.state.stream,
          channel
        },
        virgil: {
          ...this.state.virgil,
          publicKeys
        }
      });

    } catch (err) {
      if (err instanceof LookupError) {
        this.setState({
          error: 'Other user is not registered. Open another window and register that user.'
        })
      } else {
        this.setState({
          error: err.message
        });
      }
    }
  };

  _connectStream = async (backendAuthToken) => {
    // user data used to create chatstream account retrive from auth0
    const data = {
      name: this.state.sender,
      email: this.state.user.email,
      image: this.state.user.picture
    };

    const response = await post("http://localhost:9000/stream-credentials", {
      data
    }, backendAuthToken);

    const client = new StreamChat(response.apiKey);
    client.setUser(response.user, response.token);

    return {
      ...response,
      client
    };
  };

  _connectVirgil = async (backendAuthToken) => {
    const response = await post("http://localhost:9000/virgil-credentials", {}, backendAuthToken);
    const eThree = await EThree.initialize(() => response.token);

    // check if the user already backup his or her private key
    if (! await eThree.hasLocalPrivateKey()) {
      await eThree.backupPrivateKey(response.pwd);
      // await eThree.restorePrivateKey();
    }

    try {
      await eThree.register();
    } catch (err) {
      if (err instanceof IdentityAlreadyExistsError) {
        // already registered, ignore
      } else {
        this.setState({
          error: err.message
        });
      }
    }

    return {
      ...response,
      eThree
    };
  };

  _connect = async (authToken) => {
    const stream = await this._connectStream(authToken);
    const virgil = await this._connectVirgil(authToken);

    this.setState({
      stream,
      virgil
    })
    await this._handleStartChat();
  };

  render() {
    return ( 
      <div className="container">
        <div className="subtitle">
          <label> Loading... </label> 
        </div> 
      </div>
    )
  }
}