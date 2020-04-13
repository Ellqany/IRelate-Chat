import dotenv from 'dotenv';
import {
	StreamChat
} from 'stream-chat';

dotenv.config();

const nodemailer = require('nodemailer');

const mailto = (reciveremail, senderid, sender) => {
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
		to: 'ellqany@gmail.com',
		subject: 'New message recieved',
		html: `
				<h1> ${sender} send you a message</h1>
				<a href="http://localhost:3000/?id=${senderid}" target=_blank>
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

exports.sendMail = async (req, res) => {

	const data = req.body;

	if (data.type == "message.new") {

		data.members.forEach(member => {
			if (member.user.online == false) {
				const senderid = data.user.id;
				const reciveremail = member.user.email;
				const sender = data.user.name;
				mailto(reciveremail, senderid, sender);
			}
		});
	}
}
