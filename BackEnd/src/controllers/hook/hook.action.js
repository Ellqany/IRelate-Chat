import dotenv from 'dotenv';

dotenv.config();

const nodemailer = require('nodemailer');
const Auth0Manager = require("../../utils/Auth0Manager");

const mailto = (reciveremail, senderid, sender) => {
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
		to: reciveremail,
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

	// check if the message is new
	if (data.type == "message.new") {
		// check if there is a member who is offline to ssend message to
		for (let i = 0; i < data.members.length; i++) {
			const member = data.members[i];
			if (member.user.online == false) {
				const senderid = data.user.id;
				
				const id = member.user.id.replace('auth0-', 'auth0|');
				await Auth0Manager.init();
				const users = await Auth0Manager.getUser(id);
				const userdata = users.filter(item => item.user_id == id)[0];
				const reciveremail = userdata.email;

				const sender = data.user.name;
				mailto(reciveremail, senderid, sender);
			}
		}
	}
}
