import mongoose from 'mongoose';

import { webapp } from './web/server.js';
import { client } from './discord/client.js';

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log('MongoDB connected')
    })
    .then(() => {
        client.login(process.env.CLIENT_TOKEN);
    })
    .then(() => {
        console.log('Discord client logged in')
    })
    .then(() => {
        webapp.listen(process.env.PORT || 5000)
    })
    .then(() => {
        console.log('Webserver listening on port', process.env.PORT)
    })
    .catch((error) => {
        console.log(error)
    });