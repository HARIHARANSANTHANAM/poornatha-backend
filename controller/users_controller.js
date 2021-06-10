const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const account = require('../Model/users_model');
const jwt = require('jsonwebtoken');

const User_Signup = (req, res) => {
	var user = req.body;
	console.log(user);
	const { first_name, last_name, phone_no, password, email } = user;
	try {
		var salt = bcrypt.genSaltSync(14);
		var hashedPassword = bcrypt.hashSync(password, salt);
		account.findOne({ email }, (err, user) => {
			const new_user = new account({
				first_name,
				last_name,
				phone_no,
				password: hashedPassword,
				email,
			});
			new_user.save((err) => {
				if (err) {
					console.log(err);
					console.log('User Added Successfully');
					res.send(
						JSON.stringify({
							error: '',
							success: 'User Added Successfully',
							user: user,
						})
					);
				}
			});
		});
	} catch (e) {
		console.log(e);
		res.send(JSON.stringify({ error: 'User Is not Added Successfully', success: '' }));
	}
};

const User_Signin = (req, res) => {
	var { email, password } = req.body;
	var user = req.body;
	console.log(user);
	if (user.email == '' || user.password == '') {
		return res.send(JSON.stringify({ error: 'Please Add All the Fields', success: '' }));
	} else {
		account.findOne({ email: email }, (err, user) => {
			if (user) {
				bcrypt.compare(password, user.password, (err, response) => {
					if (response == true) {
						console.log(email);
						const token = jwt.sign(
							{
								email: user.email,
								userId: user.id,
							},
							process.env.JWT_KEY,
							{
								expiresIn: '1h',
							}
						);
						return res.send(JSON.stringify({ error: '', success: 'Logged In', token: token }));
					} else {
						return res.send(
							JSON.stringify({
								error: 'Invalid Username Or Password',
								success: '',
							})
						);
					}
				});
			}
		});
	}
};
module.exports = { User_Signup, User_Signin };
