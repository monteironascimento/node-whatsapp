const venom = require('venom-bot');
import { Router } from 'express';
const ofertasRouter = Router();
const pm2 = require('pm2');
import axios from 'axios';
import { tipoServicoEnum } from '../enum/TipoServicoEnum';
import { endPointDesEnum , endPointProdEnum} from '../enum/EndPointEnum';
import { isEmpty } from '../tools/Empty';
const endPoint = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? endPointProdEnum : endPointDesEnum)
    

async function startPend() {

  try {

    const objConta = {
       idPlataforma: 11, 
       tipoServiceDestino:  tipoServicoEnum.WHATSAPP , 
       username: '-1001391470703554497764607-1610729478@g.us', 
       tipoServicoOrigem: 11 

    }
     
        console.log(`Executou rotina ${tipoServicoEnum.WHATSAPP.toString()}`)
    
        objConta.username = '-1001391470703554497764607-1610729478@g.us'
        objConta.tipoServiceDestino = tipoServicoEnum.WHATSAPP
    
     
          const url = `${endPoint.urlServidorDatabase}/findPenpDivulgacao`
          //CONDICOES GERAL
          let objPostagem: any = await axios.post(url, objConta,{
            params: {
              limit: 10,
              offset: 0,
              fixado: true,
              pendente: true
            }
          })
    
          if(isEmpty(objPostagem.data)){
            objPostagem = await axios.post(url, objConta,{
              params: {
                limit: 10,
                offset: 0,
                destaque: true,
                pendente: true
              }
            })
          }
    
          if(isEmpty(objPostagem.data)){
            objPostagem = await axios.post(url, objConta,{
              params: {
                limit: 10,
                offset: 0,
                pendente: true
              }
            })
          }


          let obj;
          if(!isEmpty(objPostagem.data)){
            obj = objPostagem.data[Math.floor(Math.random() * objPostagem.data.length)]
            
        
            obj = {
              descricaoPost: `${obj.tipoorigem === 'C' ? 
                                    `Cupon ${obj.descricao}\n\n`: 
                                   `*${obj.descricao}*\n\n${(obj.precototal > obj.preco ? `💲 De: _~${obj.precototal}~_\n\n` : '')}💰 Por: *${obj.preco}*\n\n`}`,
              urlImageOrig: obj.thumbnail,
              link: obj.linkshort,
            }
          }
        
    
    
    venom
      .create()
      .then((client: any) => start(client, obj, objConta));

     

  } catch (error) {
      console.log(error);
  }

  return true;
}



async function start(client: any, objDados: any, objConta: any) {

  try {
    
    // Retrieve all groups
    //const chats = await client.getAllChatsGroups();
    //console.log(chats)
    //await client.setTheme('dark');
    var destino = '554497764607-1610729478@g.us';
    // Send image (you can also upload an image using a valid HTTP protocol)
    
    for (const key in objDados.listaOfertas) {


      try {
            const ret = await client.sendImage(
                                  destino,
                                  objDados.listaOfertas[key].urlImageOrig,
                                  'ofertabest',
                                  `🤘👏👏${objDados.listaOfertas[key].descricaoPost}➡️➡️ ${objDados.listaOfertas[key].link}`
                                )

            if(ret.statusCode = '200'){
              efetivarProcessado(objConta, objDados)
            }                                  
          
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


async function efetivarProcessado (objConta: any, objDados: any){
    
  const objPost = {
    idPlataformaContaProcessado: objDados.idPlataformaContaProcessado,
    idPlataforma : objConta.idPlataforma,
    idPlataformaConta: objConta.idPlataformaConta,
    idProcessamentoOrigem: objDados.idSincronizacao,
    idSincronizacao: objConta.idSincronizacao,
    tipoServico: objDados.tipoServico,
    tipoInformacao: tipoServicoEnum.WHATSAPP,
    idOrigem: objDados.idOrigem,
    idDestino: objConta.username,
    tpProcesso: 'P',
    hasCode: objDados.hasCode,
    idCategoria: objDados.idCategoria,
    idLoja: objDados.idLoja
  }

  const url = `${endPoint.urlServidorDatabase}/persistProcessado`
  axios.post(url, objPost);
return "OK"
}


function formatar(horarios: any) {
var data = new Date(horarios)

var day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
var date = data.getDate();
var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
var year = data.getFullYear();
var horario = `${data.getHours()}:${data.getMinutes()}`

return `${day}, ${date} de ${month} de ${year} - ${horario}`;
}


