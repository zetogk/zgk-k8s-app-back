'use strict';

const { badImplementation, serverUnavailable } = require('boom');
const fs = require('fs');
const Hapi = require('hapi');
const mongoose = require('mongoose');
const { MONGO_URL } = process.env;
console.log('MONGO_URL: ', MONGO_URL);
const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000
});

let livenessTest = true; // false: Simulate that the app has crashed
let readinessTest = 0; // 100: app ready to receive traffic

setTimeout(() => {
    readinessTest = 100;
    console.log('readiness: Components load 100%');
}, 30000);

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
            path: '/readiness-health',
            handler: async (req, h) => {

                try {

                    if (!livenessTest) {

                        return badImplementation();

                    }

                    if (readinessTest < 100) {

                        console.log('readiness-healt: Components load less than 100%');
                        return serverUnavailable();

                    }

                    return 'ok';

                } catch (err) {

                    console.error('Error on GET /readiness-health ', err.message);
                    return badImplementation();

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
            path: '/liveness-health',
            handler: async (req, h) => {

                try {

                    if (!livenessTest) {

                        return badImplementation();

                    }

                    return 'ok';

                } catch (err) {

                    console.error('Error on GET /liveness-health ', err.message);
                    return badImplementation();

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
            path: '/liveness-destroy-health',
            handler: async (req, h) => {

                try {

                    if (!livenessTest) {

                        return badImplementation();

                    }

                    livenessTest = false;

                    return 'ok';

                } catch (err) {

                    console.error('Error on POAT /liveness-destroy-health ', err.message);
                    return badImplementation();

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
            path: '/users',
            handler: async (req, h) => {

                try {

                    if (!livenessTest) {

                        return badImplementation();

                    }

                    console.log('GET /users');
                    const users = await User.find();
                    console.log('users: ', users);
                    return users;

                } catch (err) {

                    console.error('Error on GET /users ', err.message);
                    return badImplementation();

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

                    if (!livenessTest) {

                        return badImplementation();

                    }

                    console.error('Error on POST /users ', err.message);
                    const newUser = new User(req.payload);
                    await newUser.save();
                    console.log('newUser: ', newUser);
                    return newUser;

                } catch (err) {

                    console.error('Error on POST /users ', err.message);
                    return badImplementation();

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

                    if (!livenessTest) {

                        return badImplementation();
                        throw error;
                    }

                    const plans = await Plan.find();
                    console.log('plans: ', plans);
                    return plans;

                } catch (err) {

                    console.error('Error on GET /plans ', err.message);
                    return badImplementation();

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

                    if (!livenessTest) {

                        return badImplementation();
                        throw error;
                    }

                    const newPlan = new Plan(req.payload);
                    await newPlan.save();
                    await fs.writeFileSync(`files_plans/${newPlan._id}.txt`, JSON.stringify(newPlan));
                    console.log('newPlan: ', newPlan);
                    return newPlan;

                } catch (err) {

                    console.error('Error on POST /plans ', err.message);
                    return badImplementation();

                }

            }
        });

        await server.start();

    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running the v2 at:', server.info.uri);
};

start();
