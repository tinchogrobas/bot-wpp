const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({ authStrategy: new LocalAuth() });
const sourceGroup = 'Alertas - AMBA 05'; // Nombre del grupo origen
const targetGroup = '(NOTIFICACIONES) Ministerio de Kirchnerismo o Libertad!'; // Nombre del grupo destino
let lastMessageIds = new Set();

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('Bot is ready!'));

async function checkMessages() {
    const chats = await client.getChats();
    const sourceChat = chats.find(c => c.isGroup && c.name === sourceGroup);
    const targetChat = chats.find(c => c.isGroup && c.name === targetGroup);
    
    if (!sourceChat || !targetChat) return;
    
    const messages = await sourceChat.fetchMessages({ limit: 10 });
    const newMessages = messages.filter(msg => !lastMessageIds.has(msg.id.id));
    
    if (newMessages.length > 0) {
        newMessages.forEach(msg => lastMessageIds.add(msg.id.id));
        for (const msg of newMessages) {
            await client.sendMessage(targetChat.id._serialized, msg.body);
        }
    }
}

setInterval(checkMessages, 60000);
client.initialize();