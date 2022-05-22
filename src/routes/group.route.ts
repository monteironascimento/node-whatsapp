const venom = require('venom-bot');
import { Router } from 'express';
const ofertasRouter = Router();
const pm2 = require('pm2');

ofertasRouter.post("/", async (req, res) => {

  try {
    //restart();
    const obj = req.body;
    const bot = await venom.create();
    start(bot, obj);
    //bot.close();

    /*venom
      .create()
      .then((client: any) => start(client, obj));*/

  } catch (error) {
      console.log(error);
  }

  return res.status(201).json({ status: "OK"});
})

async function restart(){

  try {
    sleep(10000);
    pm2.connect(function(err: any) {
        pm2.restart('whatsapp', (err: any, proc: any) => {
      })
    })
  } catch (error) {
    
  }

}

async function start(client: any, objDados: any) {

  try {
    
    // Retrieve all groups
    //const chats = await client.getAllChatsGroups();
    //console.log(chats)
    //await client.setTheme('dark');
    var destino = '554497764607-1610729478@g.us';
    // Send image (you can also upload an image using a valid HTTP protocol)
    
    for (const key in objDados.listaOfertas) {


      try {
            await client.sendImage(
                                  destino,
                                  objDados.listaOfertas[key].urlImageOrig,
                                  'ofertabest',
                                  `🤘👏👏${objDados.listaOfertas[key].descricaoPost}➡️➡️ ${objDados.listaOfertas[key].link}`
                                )
          
        } catch (error) {
            console.log(error);
        }
        
    }

      
      try {
        
        await client
            .sendText(destino, `Para mais ofertas acesse: https://ofertabest.com`)
      } catch (error) {
        
      }

    } catch (error) {
      console.log(error)
    }
    
   // restart();  
}

async function sleep(ms: any) {
  return new Promise((resolve: any) => {
    setTimeout(resolve, ms);
  });
}

export { ofertasRouter };

export function initChat(){
  try {
    
    do{
    venom
      .create()
      .then((client: any) => startNow(client));

      function startNow(client: any) {
        client.onMessage((message: any) => {
          //if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
              .sendText(message.from, 'Bem vindo ao https://ofertabest.com')
              .then((result: any) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro: any) => {
                console.error('Error when sending: ', erro); //return object error
              });
          //}
        });
      }
    }while(true);

  } catch (error) {
    
  }
}