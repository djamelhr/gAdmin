class gsuiteBot {
    constructor() {
        this.config = require('./config/puppeteer.json');
    }

    async initPuppeter() {
        const puppeteer = require('puppeteer');
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless,
            args: ['--no-sandbox'],
        });
        this.page = await this.browser.newPage();
        this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        this.page.setViewport({ width: 1500, height: 764 });
    };
    async visitAdminGoogle() {
        await this.page.goto(this.config.base_url, { timeout: 60000 });
        await this.page.waitFor(2500);
        await this.page.waitForSelector(this.config.selectors.username_field);//wait for selector
        /* Click on the username field using the field selector*/
        await this.page.type(this.config.selectors.username_field, this.config.username);
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));
        await this.page.keyboard.press("Enter");

        /* Click on the password field using the field selector*/
        await this.page.waitFor(2500);
        await this.page.waitForSelector(this.config.selectors.password_field);
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));//wait for random amount of time
        await this.page.type(this.config.selectors.password_field, this.config.password);
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));//wait for random amount of time
        await this.page.keyboard.press("Enter");
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));//wait for random amount of time

    };
    async visitUsersUrl() {
        await this.page.goto(this.config.users_url, { timeout: 60000 });
        await this.page.waitForSelector(this.config.selectors.table_row)
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));

        let users = await this.page.evaluate((config) => {

            const trs = Array.from(document.querySelectorAll(config.selectors.table_row));
            // loop through users
            return trs.map(link => {
                return {
                    firstName: link.querySelector(config.selectors.user_firstname).textContent,
                    lastName: link.querySelector(config.selectors.user_lastname).textContent,
                    status: link.querySelector(config.selectors.user_status).innerText, //we will remove (tilføjet for nylig) if u want
                    email: link.querySelector(config.selectors.user_email).innerText
                }
            })
        }, this.config)
        return users
    };
    async visitPlanUrl() {
        await this.page.goto(this.config.plan_url, { waitUntil: 'load', timeout: 60000 });

        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));

        await this.page.waitForSelector(this.config.selectors.plan_cards)
        let plans = await this.page.evaluate((config) => {
            const cards = Array.from(document.querySelectorAll(config.selectors.plan_cards));
            // loop through cards 
            return cards.map(card => {
                if (card.querySelector(config.selectors.plan_content)) {
                    return {
                        name: card.querySelector(config.selectors.plan_name).textContent,
                        currency: card.querySelectorAll(config.selectors.plan_columns)[2].textContent,
                        users: parseInt(card.querySelectorAll(config.selectors.plan_columns)[1].textContent),
                        price: parseFloat(card.querySelectorAll(config.selectors.plan_columns)[4].textContent.replace(/[^0-9,^0-9-]+/g, "")),
                        cycle: card.querySelectorAll(config.selectors.plan_columns)[4].textContent,
                    }
                }

            })

        }, this.config);
        plans = plans.filter(x => !!x);//remove null values 
        return plans
    };
    async closeBrowser() {
        await this.page.waitFor(this.config.settings.wait_for + Math.floor(Math.random() * 250));
        await this.browser.close();
    }
}
module.exports = gsuiteBot;