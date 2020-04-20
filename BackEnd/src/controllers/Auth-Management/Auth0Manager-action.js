import dotenv from 'dotenv';

dotenv.config();

const Auth0Manager = require("../../utils/Auth0Manager");

exports.getUser = async (req, res) => {
	const id = req.body.id;
	await Auth0Manager.init();
	const users = await Auth0Manager.getUser(id);

	const user = users.filter(item => item.user_id == id)[0];

	res.status(200).json({
		user
	});
}
