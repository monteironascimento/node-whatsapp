import express from 'express';
import { initChat, ofertasRouter } from './routes/group.route';

const port = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? 3046 : 3045);

const app = express();
console.log(`START  NODE-WHATSAPP - AMBIENTE ${process.env.NODE_ENV}   PORTA ${port}`)

app.use(express.json());

app.use( "/postWats", ofertasRouter);

app.get('/', (require, response) => {
    return response.json({status: "OK"});
})

//initChat();

app.listen(port);