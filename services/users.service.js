"use strict";

const _ = require("lodash");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const User = require("../models/user.model");
const CacheCleaner = require("../mixins/cache.cleaner.mixin");
const Fakerator = require("fakerator");
const Email = require('email-templates');
const fake = new Fakerator();


module.exports = {
	name: "users",
	mixins: [DbService, CacheCleaner(["users"])],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost/moleculer-blog", { useNewUrlParser: true, useUnifiedTopology: true }),
	model: User,

	settings: {
		fields: ["_id", "name", "email", "age", "salary"]
	},

	actions: {
		
		filteredUser:{
			handler(ctx) {
				return this.adapter.find({ salary:{ $gte:10000, $lte:15000 } });
			}
		},
		sendMail:{
			handler(ctx){
				const email = new Email({
					message: {
					  from: 'niftylettuce@gmail.com'
					},
					// uncomment below to send emails in development/test env:
				    send: true,
					transport: {
					  jsonTransport: true
					}
				  });
				   
				  email
					.send({
					  template: 'mars',
					  message: {
						to: 'ims.msnegi@gmail.com'
					  },
					  locals: {
						name: 'Elon'
					  }
					})
					.then(data => {status:"success"})
					.catch(console.error);
			}
		}
	},

	methods: {
		async seedDB() {
		
			let users =  await this.adapter.insertMany(_.times(5, () => {
				let fakeUser = fake.entity.user();
				return {
					name: fakeUser.firstName + " " + fakeUser.lastName,
					image: fake.random.number(1, 20) + ".jpg",
					age: fake.random.number(20, 90),
					phone: fake.phone.number(),
					email: fakeUser.email,
					salary: fake.random.number(4000, 50000)
					
				};
			}));

			
			return true;
		}
	},

	async afterConnected() {
		const count = await this.adapter.count();
		if (count == 0) {
			return this.seedDB();
		}
	}

};
