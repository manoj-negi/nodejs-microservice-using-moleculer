"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		"default": ""
	},
	image:{
		type: String,
		trim: true,
		"default": ""
	},
	age:{
		type: Number,
		trim: true,
		required: "age is required"
	},
	phone:{
		type: String,
		trim: true,
		required: "Number is required"
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		index: true,
		lowercase: true,
		required: "Please fill in an email"
	},
	salary:{
		 type: Number,
		 trim:true,
		 required:"Salary Required"
	}
	
}, {
	timestamps: true
});



module.exports = mongoose.model("User", UserSchema);
