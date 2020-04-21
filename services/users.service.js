"use strict";

const _ = require("lodash");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const User = require("../models/user.model");
const CacheCleaner = require("../mixins/cache.cleaner.mixin");
const Fakerator = require("fakerator");
const fake = new Fakerator();


module.exports = {
	name: "users",
	mixins: [DbService, CacheCleaner(["users"])],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost/moleculer-blog", { useNewUrlParser: true, useUnifiedTopology: true }),
	model: User,

	settings: {
		fields: ["_id", "username", "fullName", "email", "avatar", "author"]
	},

	actions: {
		authors: {
			cache: true,
			handler(ctx) {
				return this.adapter.find({ query: { author: true }});
			}
		}
	},

	methods: {
		async seedDB() {
		
			let users =  await this.adapter.insertMany(_.times(100, () => {
				let fakeUser = fake.entity.user();
				return {
					username: fakeUser.userName,
					password: fakeUser.password,
					fullName: fakeUser.firstName + " " + fakeUser.lastName,
					email: fakeUser.email,
					avatar: fakeUser.avatar,
					author: false
				};
			}));

			
			return this.clearCache();
		}
	},

	async afterConnected() {
		const count = await this.adapter.count();
		if (count == 0) {
			return this.seedDB();
		}
	}

};
