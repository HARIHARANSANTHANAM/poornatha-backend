const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
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

const User_ForgetPassword = (req, res) => {
	var { email } = req.body;
	//var user = req.body;
	console.log(email);
	if (email == "" ) {
	  return res.send(
		JSON.stringify({ error: "Please Add All the Fields", success: "" })
	  );
	} else {
	  account.findOne({ email: email }, (err, user) => {
		if (user) {
			  console.log(email);

  
			  let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL, // TODO: your gmail account
					pass:  process.env.PASSWORD // TODO: your gmail password
				}
			});
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
			const userid = user._id;
			const link = `http://localhost:3000/ResetPassword/${userid}/${token}`
			// Step 2
			let mailOptions = {
				from: 'Poornatha', // TODO: email sender
				to: email, // TODO: email receiver
				subject: 'Nodemailer - Test',
				text: link
			};
			
			// Step 3
			transporter.sendMail(mailOptions, (err, data) => {
				if (err) {
					return log('Error occurs',err);
				}
				return log('Email sent!!!');
			});
  
  			  return res.send(
				JSON.stringify({ error: "", success: "Logged In", user: user })
			  );
			} else {
			  return res.send(
				JSON.stringify({
				  error: "Invalid Username Or Password",
				  success: "",
				})
			  );
			}
	  });
	}
  };
  
const User_ResetPassword = async (req, res) => {
	console.log(typeof(req.params._id))
	var salt = bcrypt.genSaltSync(14);
		var hashedPassword = bcrypt.hashSync(req.body.password, salt);
		try {
		  const user = await account.findByIdAndUpdate(req.params._id, {password:hashedPassword}, {
			new: true,
			runValidators: true,
		  });
	  
		  res.status(200).json({
			status: 'Success',
	  
			data: {
			  user,
			},
		  });
		} catch (err) {
		  res.status(400).json({
			status: ' fail',
			message: 'In   valid data set',
		  });
		}
}


module.exports = { User_Signup, User_Signin ,User_ForgetPassword,User_ResetPassword};
