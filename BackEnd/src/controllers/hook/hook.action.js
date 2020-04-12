import dotenv from 'dotenv';
import {
	StreamChat
} from 'stream-chat';

dotenv.config();

const nodemailer = require('nodemailer');

exports.sendMail = async (req, res) => {

	const data = req.body;

	if (data.type == "message.new") {
		if (data.watcher_count <  2) {
			const users = data.channel_id.split('_');
			const apiKey = process.env.STREAM_API_KEY;
			const apiSecret = process.env.STREAM_API_SECRET;

            let userid = '';
            let senderid = '';

			if (data.user.id === users[0]) {
				userid = users[1];
				senderid = users[0];
			} else {
				userid = users[0];
				senderid = users[1];
			}

			const client = new StreamChat(apiKey, apiSecret);
			const Chatusers = await client.queryUsers({
				id: userid
			});

            const Chatuser = Chatusers.users[0];
            const useremail = Chatuser.data.email;

			var transporter = nodemailer.createTransport({
				host: process.env.MAIL_HOST,
				port: process.env.MAIL_PORT,
				auth: {
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD
				}
			});

			var mailOptions = {
				from: process.env.MAIL_USERNAME,
				to: useremail,
				subject: 'New message recieved',
				html: `
			            <h1> ${data.user.data.name} send you a message</h1>
                        <a href="http://localhost:3000/?${senderid}" target=_blank>
                            Click here to see the message
                        </a>
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
	}
}
