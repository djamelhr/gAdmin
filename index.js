const Bot = require('./Bot');
const config = require('./Bot/config/puppeteer.json');
const run = async () => {
    const bot = new Bot();

    const startTime = Date();

    await bot.initPuppeter().then(() => console.log("PUPPETEER INITIALIZED"));

    await bot.visitAdminGoogle().then(() => console.log("BROWSING Google Admin"));

    await bot.visitUsersUrl().then((users) => console.log(users));

    await bot.visitPlanUrl().then((plans) => console.log(plans));

    await bot.closeBrowser().then(() => console.log("BROWSER CLOSED"));

    const endTime = Date();

    console.log(`START TIME - ${startTime} / END TIME - ${endTime}`)

};

run().catch(e => console.log(e.message));
//run bot at certain interval we have set in our config file
setInterval(run, config.settings.run_every_x_hours * 3600000);