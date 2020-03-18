import "@babel/polyfill";
const TelegramBot = require('node-telegram-bot-api');
import { UserRepository } from './repository/UserRepository';
import { DBConnection } from "./database/DBConnection";
require('dotenv').config();
const CronJob = require('cron').CronJob;

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
    console.log({create});
}

async function getName ({origin}) {
    let username = origin.first_name;

    if (origin.last_name) {
        username += ' ' + origin.last_name;
    }

    return username;
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
    } else {
        createJobs();
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
        createJobs();
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

bot.on("polling_error", (err) => console.log(err));

function sendNotification (chatId) {
    return function () {
        bot.sendMessage(chatId, url); 
        bot.sendMessage(chatId, 'If u done type "/off"');
    }
    
}

function jobIsActive (chatId) {
    return currentJobs.some(e => e.chatId === chatId && e.activate === true);
}

async function createJobs () {
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
    const cronTimer = `*/${frequency} 0-21 * * *`;
    const cb = await sendNotification(chatId);
    try {
        return new CronJob(cronTimer, cb);
    } catch(e) {
        console.log(e);
    }

}

createJobs();
