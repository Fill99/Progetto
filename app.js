var config={
userName: process.env.DB_NAME,
password:process.env.DB_PASSWORD,
server:process.env.DB_SERVER,
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
var server=new Hapi.Server({host:process.env.HOST,port:process.env.HOST});

var conn=new Connection(config);

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



server.start(function(err){
    if(err)
    {
        throw err;
    }
    console.log('Server is running on : '+server.info.uri);
});




function Esegui(reply)
{
    var riga={};
    var righe=[];
    var request=new Request('SELECT * FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzo AS I ON LI.Id_Indirizzo=I.Id_Indirizzo',function(err,rowcount){
        if (err)
        {
            console.log(err);
        }
        else{
            console.log(rowcount+' Rows');
        }
    });
    request.on('row',function(columns){
        columns.forEach(function(column){
            riga[column.metadata.colName]=column.value;
        });
        righe.push(riga);
    });
}