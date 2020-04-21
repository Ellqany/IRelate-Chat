import dotenv from 'dotenv';

dotenv.config();

const nodemailer = require('nodemailer');
const Auth0Manager = require("../../utils/Auth0Manager");

const createLink = (methods, user_id) => {
	// the application url
	const appurl = 'http://localhost:3000';
	// link to share the user chat page (comunicate with the registerate user)
	const usrl = `https://api.addthis.com/oexchange/0.8/forward/${methods}/offer?url=${appurl}/?id=${user_id}`
	return usrl;
}

const mailto = (reciveremail, reciverid, sender) => {
	reciverid = reciverid.replace('auth0|', 'auth0-');

	// create nodemailer opject to send mails

	var transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD
		}
	});

	// message options
	var mailOptions = {
		from: process.env.MAIL_USERNAME,
		to: 'ellqany@gmail.com',
		subject: 'New message recieved',
		html: `			
				<h2 style="width: 80%; float: left; margin: 4px;">${sender.name} send you a message</h2>
				
				<a href="http://localhost:3000/?id=${sender.id}" target=_blank>
					Click here to see the message
				</a>

				<div style="text-align: center; padding: 4px;">
					<a href=${createLink("facebook", reciverid)} target="_blank" rel="noopener noreferrer" style="padding: 4px;">
						<img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/facebook.png" border="0" alt="Facebook" />
					</a>

					<a href=${createLink("messenger", reciverid)} target="_blank" rel="noopener noreferrer" style="padding: 4px;">
						<img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/messenger.png" border="0" alt="Facebook Messenger" />
					</a>

					<a href=${createLink("whatsapp", reciverid)} target="_blank" rel="noopener noreferrer" style="padding: 4px;">
						<img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/whatsapp.png" border="0" alt="WhatsApp" />
					</a>

					<a href=${createLink("twitter", reciverid)} target="_blank" rel="noopener noreferrer" style="padding: 4px;">
						<img src="https://cache.addthiscdn.com/icons/v3/thumbs/32x32/twitter.png" border="0" alt="Twitter" />
					</a>
				</div>

			`
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

exports.sendMail = async (req, res) => {
	const data = req.body;

	// check if the message is new
	if (data.type == "message.new") {
		// check if there is a member who is offline to ssend message to
		for (let i = 0; i < data.members.length; i++) {
			const member = data.members[i];
			if (member.user.online == false) {	
				const id = member.user.id.replace('auth0-', 'auth0|');
				await Auth0Manager.init();
				const users = await Auth0Manager.getUsers();
				const userdata = users.filter(item => item.user_id == id)[0];
				const reciveremail = userdata.email;

				const sender = data.user;
				mailto(reciveremail, id, sender);
			}
		}
	}
}
