const TelegramBot = require('node-telegram-bot-api');

const token = '7261658966:AAFGIaGkFwvK4K2I8GF4fP44nMEmVka_Xgc';
const webbAppUrl = 'https://gilded-beignet-59d4e2.netlify.app/';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Welcome. Click to play', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Play', web_app: {url: webbAppUrl}}]
                ]
            }
        })
    }

});