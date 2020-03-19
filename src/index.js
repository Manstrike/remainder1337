import "@babel/polyfill";
const TelegramBot = require('node-telegram-bot-api');
import { UserRepository } from './repository/UserRepository';
import { DBConnection } from "./database/DBConnection";
require('dotenv').config();
const CronJob = require('cron').CronJob;
const http = require('http');

const connection = new DBConnection();

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

const url = 'https://youtu.be/2pLT-olgUJs';
let currentJobs = [];

bot.onText(/\/start/, startHandler);

async function startHandler (msg) {
    const chatId = msg.chat.id;

    const username = await getName({origin: msg.from});

    const userRepo = new UserRepository({connection});
    const create = await userRepo.create({
        chatId, username
    });
    bot.sendMessage(chatId, 'You were added to DB. Autoremainder will notificate you every hour. Type /help to learn more');

    if (!currentJobs.some(e => Number(e.chatId) === Number(chatId))) {
        const job = await createJob({frequency: 60, chatId: chatId});
        job.start();

        const jobDesc = {
            chatId :chatId,
            job,
        };

        currentJobs.push(jobDesc);
    }

    console.log({'currentJobs on /start' : currentJobs});
}

bot.onText(/\/send_every (.+)/, changeFrequency);

async function changeFrequency (msg, match) {
    const chatId = msg.chat.id;
    if (!Number(match[1])) {
        bot.sendMessage(chatId, 'Wrong period was specified. Please, remember thar period counts is minutes, for example, "/send_every 60" means "every 60 minutes"');
        return;
    }

    const userRepo = new UserRepository({connection});
    const changed = await userRepo.update({
        chatId, 
        frequency: match[1],
        activated: 1
    });

    if (!currentJobs.some(e => Number(e.chatId) === Number(chatId))) {
        const job = await createJob({frequency: match[1], chatId: chatId});
        job.start();

        const jobDesc = {
            chatId :chatId,
            job,
        };

        currentJobs.push(jobDesc);
    }

    if (currentJobs.length !== 0) {
        const newJob = await createJob({frequency: match[1], chatId: chatId});
        currentJobs = currentJobs.map(e => {
            if (Number(e.chatId) === Number(chatId)) {
                e.job = newJob;
                e.job.start();
            }
    
            return e;
        });
    }
    
    bot.sendMessage(chatId, changed);
}

bot.onText(/\/off/, disableNotifications);

async function disableNotifications (msg) {
    const chatId = msg.chat.id;
    
    const userRepo = new UserRepository({connection});
    const disabled = await userRepo.update({
        chatId,
        activated: 0
    });

    if (currentJobs.length !== 0) {
        currentJobs = currentJobs.map(e => {
            if (Number(e.chatId) === Number(chatId)) {
                e.job.stop();
            }
    
            return e;
        });
    }


    console.log('after disable ', currentJobs);

    bot.sendMessage(chatId, disabled);
}

bot.onText(/\/on/, enableNotifications);

async function enableNotifications (msg) {
    const chatId = msg.chat.id;

    const userRepo = new UserRepository({connection});
    const enabled = await userRepo.update({
        chatId,
        activated: 1
    });

    if (currentJobs.length === 0) {
        const [user, ] = userRepo.read({row: 'chatId', value: chatId});
        const job = await createJob({frequency: user.frequency, chatId: user.chatId});
        job.start();

        const jobDesc = {
            chatId: user.chatId,
            job,
        };

        currentJobs.push(jobDesc);
    } else {
        currentJobs = currentJobs.map(e => {
            if (Number(e.chatId) === Number(chatId)) {
                e.job.start();
            }

            return e;
        });
    }
    
    console.log('after enable ', currentJobs);

    bot.sendMessage(chatId, enabled);
}

bot.onText(/\/help/, helpMessage);

async function helpMessage (msg) {
    const chatId = msg.chat.id;

    const message = [
        '/off - disables auto-notifications',
        '/on - enables auto-notifications',
        '/send_every [minutes] - set notification frequency',
        '/info'
    ];

    bot.sendMessage(chatId, message.join('\n'));
}

bot.onText(/\/info/, infoMessage);

async function infoMessage (msg) {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Бот для забывчивой зайки');
}

bot.on("polling_error", (err) => console.log(err));

function sendNotification (chatId) {
    return function () {
        bot.sendMessage(chatId, url); 
        bot.sendMessage(chatId, 'If u done type "/off"');
    }
    
}

async function getName ({origin}) {
    let username = origin.first_name;

    if (origin.last_name) {
        username += ' ' + origin.last_name;
    }

    return username;
}

async function createJobs () {
    currentJobs = [];
    const userRepo = new UserRepository({connection});
    const [users, ] = await userRepo.read({row: 'activated', value: 1});

    for (const user of users) {
        const job = await createJob({frequency: user.frequency, chatId: user.chatId});
        job.start();

        const jobDesc = {
            chatId :user.chatId,
            job,
        };

        currentJobs.push(jobDesc);
    }
}

async function createJob({frequency, chatId}) {
    const cronTimer = `*/${frequency} 9-21 * * *`;
    const cb = await sendNotification(chatId);
    try {
        return new CronJob(cronTimer, cb);
    } catch(e) {
        console.log(e);
    }

}

async function createMainWatcher () {
    const cronTimer = `*/60 23 * * *`;
    
    const job = new CronJob(cronTimer, () => {
        createJobs();
    });
    job.start();
    
    createJobs();
    console.log('initial jobs', currentJobs);
}

createMainWatcher();

http.createServer(async(request, response)=>{
     
    response.end("Hello world!");
}).listen(process.env.PORT || 8080);
