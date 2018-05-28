var config={
userName: 'studente',
password:'password.123',
server:'server-progetto.database.windows.net',
options:
{
database: 'Progetto',
encrypt:true

}

};

var Connection=require('tedious').Connection;
var Request=require('tedious').Request;
var TYPES=require('tedious').TYPES;


var Hapi=require('hapi');
var server=new Hapi.Server();

server.connection({host:process.env.host,port:process.env.port});

var conn=new Connection(config);
console.log('');

server.route({
method:'GET',
path:'/',
handler: function(request,reply){
    conn.on('connect',function(err){
        if(err)
        console.log(err);
        else
        {
            console.log('Connected');
            Esegui(reply);
        }
        
    });
}
});
server.route({
    method:'GET',
    path:'/benvenuto',
    handler:function(request,reply){
    reply('Benvenuto');
    }
});



server.start(function(err){
    if(err)
    {
        console.log(err);
    }
    console.log('Server is running on : '+server.info.uri);
});




function Esegui(reply)
{
    var riga={};
    var righe=[];
    var request=new Request('SELECT * FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzi AS I ON LI.Id_Indirizzo=I.Id_Indirizzo',function(err,rowcount){
        if (err)
        {
            console.log(err);
        }
        else{
            console.log(rowcount+' Rows');
            reply(JSON.stringify(righe);
        }
    });
    request.on('row',function(columns){
        columns.forEach(function(column){
            riga[column.metadata.colName]=column.value;
        });
        righe.push(riga);
    });
    conn.execSql(request);
}