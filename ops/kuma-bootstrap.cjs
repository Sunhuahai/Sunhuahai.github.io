// Run inside the official Kuma container. Credentials arrive via stdin prelude.
// Never log credentials or login tokens.
const {io}=require('/app/node_modules/socket.io-client');
const socket=io('http://127.0.0.1:3001',{transports:['websocket'],reconnection:false,autoConnect:false});
const call=(event,...args)=>new Promise((resolve,reject)=>socket.timeout(30000).emit(event,...args,(err,result)=>err?reject(err):result?.ok===false?reject(new Error(event+': '+result.msg)):resolve(result)));
let monitors={};socket.on('monitorList',list=>{monitors=list});
const deadline=setTimeout(()=>{console.error('Bootstrap timed out');process.exit(1)},120000);
socket.on('connect_error',()=>{console.error('Kuma connection failed');process.exit(1)});
let started=false;socket.on('info',async()=>{if(started)return;started=true;try{
 if(await call('needSetup'))await call('setup',creds.username,creds.password);console.log('Admin setup checked.');
 await call('login',{username:creds.username,password:creds.password,token:''});console.log('Private authentication verified.');
 const existing=Object.values(monitors).find(m=>m.name==='Huahai Atlas Website');
 const result=existing?{monitorID:existing.id}:await call('add',{type:'http',name:'Huahai Atlas Website',url:'http://127.0.0.1:18080/',method:'GET',interval:60,retryInterval:30,maxretries:2,timeout:10,accepted_statuscodes:['200-299'],notificationIDList:{},conditions:[],kafkaProducerBrokers:[],kafkaProducerSaslOptions:{mechanism:'None'},rabbitmqNodes:[],ignoreTls:false,upsideDown:false,maxredirects:5,resendInterval:0});
 try{await call('getStatusPage','atlas')}catch{await call('addStatusPage','Huahai Atlas — Status','atlas')}
 const r=await call('getStatusPage','atlas');
 const config={...r.config,slug:'atlas',title:'Huahai Atlas — Status',description:'Availability and maintenance notices for Huahai Atlas.',theme:'auto',autoRefreshInterval:60,showTags:false,footerText:'',customCSS:'',showPoweredBy:true,showCertificateExpiry:false,googleAnalyticsId:'',domainNameList:[]};
 await call('saveStatusPage','atlas',config,'/icon.svg',[{name:'Huahai Atlas',weight:1,monitorList:[{id:result.monitorID,sendUrl:false}]}]);
 console.log('Kuma initialized: admin protected, HTTP monitor active, status page atlas configured, notifications intentionally empty.');
 clearTimeout(deadline);socket.disconnect();process.exit(0);
}catch(e){console.error(e.message);socket.disconnect();process.exit(1)}});

socket.connect();
