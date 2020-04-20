// src/components/SocialLink.js

import React from 'react';

export class SocialLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user
        };
    }

    // this function create socail network link to share user page
    createLink = (methods, user_id) => {
        // the application url
        const appurl = 'http://localhost:3000';
        // link to share the user chat page (comunicate with the registerate user)
        const usrl = `https://api.addthis.com/oexchange/0.8/forward/${methods}/offer?url=${appurl}/?id=${user_id}&pubid=ra-42fed1e187bae420&title=Chat%20Me&ct=1`
        return usrl;
    }

    render = () => {
        if(this.state.user) {
            const user_id = this.state.user.sub.replace('auth0|', 'auth0-');
            return (
                <div className="socialLink">
                    <a href={this.createLink("facebook", user_id)} target="_blank" rel="noopener noreferrer">
                        <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/facebook.png" border="0" alt="Facebook" />
                    </a>

                    <a href={this.createLink("messenger", user_id)} target="_blank" rel="noopener noreferrer">
                        <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/messenger.png" border="0" alt="Facebook Messenger" />
                    </a>

                    <a href={this.createLink("whatsapp", user_id)} target="_blank" rel="noopener noreferrer">
                        <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/whatsapp.png" border="0" alt="WhatsApp" />
                    </a>

                    <a href={this.createLink("twitter", user_id)} target="_blank" rel="noopener noreferrer">
                        <img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/twitter.png" border="0" alt="Twitter" />
                    </a>
                </div>
            )
        }else{
            return <div className="socialLink"></div>
        }
    }
}