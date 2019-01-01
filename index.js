'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const { MONGO_URL } = process.env;
console.log('MONGO_URL: ', MONGO_URL);
const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000
});

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

                try {

                    console.log('GET /users');
                    const users = await User.find();
                    console.log('users: ', users);
                    return users;

                } catch (err) {

                    console.error('Error on GET /users ', err.message);

                }

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

                try {

                    console.error('Error on POST /users ', err.message);
                    const newUser = new User(req.payload);
                    await newUser.save();
                    console.log('newUser: ', newUser);
                    return newUser;

                } catch (err) {

                    console.error('Error on POST /users ', err.message);

                }

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

                try {

                    console.error('GET /plans ', err.message);
                    const plans = await Plan.find();
                    console.log('plans: ', plans);
                    return plans;

                } catch (err) {

                    console.error('Error on GET /plans ', err.message);

                }

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

                try {

                    console.error('POST /plans ', err.message);
                    const newPlan = new Plan(req.payload);
                    await newPlan.save();
                    console.log('newPlan: ', newPlan);
                    return newPlan;

                } catch (err) {

                    console.error('Error on POST /plans ', err.message);

                }

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
