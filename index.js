'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const { MONGO_URL, PORT } = process.env;
const server = Hapi.server({
    host: 'localhost',
    port: PORT
});

// Start the server
const start = async function () {

    try {

        mongoose.connect(MONGO_URL, { useNewUrlParser: true });
        const User = mongoose.model('User', { email: { type: String, index: { unique: true } }, name: String });
        const Plan = mongoose.model('Plan', {
            name: String,
            city: String,
            country: String,
            description: String
        });

        server.route({
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'GET',
            path: '/users',
            handler: async (req, h) => {

                const users = await User.find();
                console.log('users: ', users);
                return users;

            }
        });

        server.route({
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'POST',
            path: '/users',
            handler: async (req, h) => {

                const newUser = new User(req.payload);
                await newUser.save();
                console.log('newUser: ', newUser);
                return newUser;

            }
        });

        server.route({
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'GET',
            path: '/plans',
            handler: async (req, h) => {

                const plans = await Plan.find();
                console.log('plans: ', plans);
                return plans;

            }
        });

        server.route({
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'POST',
            path: '/plans',
            handler: async (req, h) => {

                const newPlan = new Plan(req.payload);
                await newPlan.save();
                console.log('newPlan: ', newPlan);
                return newPlan;

            }
        });

        await server.start();

    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();