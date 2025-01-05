import Agenda from 'agenda';
import config from './config.js';
import { welcomeEmail, congratulatoryEmail } from "../services/email.service.js";

const mongoConnectionString = config.MONGODB_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('send welcome email', async (job) => {
    const { email } = job.attrs.data;
    await welcomeEmail(email);
});

agenda.define('send congratulatory email', async (job) => {
    const { email } = job.attrs.data;
    await congratulatoryEmail(email);
});

(async function() {
    await agenda.start();
    console.log('Agenda started!');
})();

export default agenda;