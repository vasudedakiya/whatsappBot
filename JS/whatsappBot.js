//nodeJs
//check it by => npm -v
//npm install xlsx
//npm install puppeteer
//npm install whatsapp-web.js

// after all instalation you can run program by => npm whatsappBot.js
const fs = require('fs');
const xlsx = require('xlsx');
const { Client, MessageMedia } = require('whatsapp-web.js');



// Add your image & file here *****************************
const workbook = xlsx.readFile('../Excle/Test.xlsx');
const photo = "../Images/passport_size.jpg"
const Message = "Your message here";
// things we can customize ********************************



const worksheet = workbook.Sheets['Sheet1'];
const columnName = 'Mobile No';
const jsonData = xlsx.utils.sheet_to_json(worksheet);
const columnData = jsonData.map(row => row[columnName]);
const mobileNumbers = columnData.map(number => "91" + number);

const client = new Client({
    puppeteer: { headless: false }
});

client.initialize();
console.log("step-1 Initialize");

client.on('qr', (qr) => {
    console.log("Step-2 QR-code Scan");
});

client.on('ready', () => {
    console.log("Step-3 Logged In");
    SendMsg();
});

async function SendMsg() {
    console.log("Step-4 Gone in Loop of numbers");
    mobileNumbers.forEach(async (number) => {
        try {
            await sendMessage(number.replaceAll(/\s/g, ''), Message);
            await sendImage(number.replaceAll(/\s/g, ''), photo);
        } catch (err) {
            console.error(`Failed to send message to ${number}:`, err);
        }
    });
}

async function sendMessage(number, message) {
    const chat = await client.getChatById(number + '@c.us');
    await chat.sendMessage(message);
    console.log("step-5 Message sended to => " + number);
}

async function sendImage(number, path) {
    const chat = await client.getChatById(number + '@c.us');
    const media = MessageMedia.fromFilePath(path);
    await chat.sendMessage(media);
    console.log("step-6 Image sended to => " + number);
}