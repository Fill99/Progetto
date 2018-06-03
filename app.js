var config = {
    userName: 'studente',
    password: 'password.123',
    server: 'server-progetto.database.windows.net',
    options:
        {
            database: 'Progetto',
            encrypt: true

        }
};

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({ host: process.env.HOST || "localhost", port: process.env.PORT || 8080 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var conn = new Connection(config);
        conn.on('connect', function (err) {
            if (err)
                console.log(err);
            else {
                console.log('Connected');
                Esegui(conn, reply);
            }

        });
    }
});
server.route({
    method: 'GET',
    path: '/benvenuto',
    handler: function (request, reply) {
        reply('Benvenuto');
    }
});

server.route({
    method:'GET',
    path:'/indirizzo',
    handler:function(request,reply){
       var conn=new Connection(config);
       conn.on('connect',function(err){
           if(err)
           {
               console.log(err);
           }
           else{
               console.log('Connected to database');
               Selezione_Linea(reply,conn,request.query.indirizzo);
           }
       });
    }
});



server.route({
    method:'GET',
    path:'/ricercaincroci',
    handler:function(request,reply)
    {
        var conn=new Connection(config);
        conn.on('connect',function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log('Database connected');
                RicercaIncroci(reply,conn,request.query.id1,request.query.id2);
            }
        });
    }
});

server.route({
    method:'GET',
    path:'/indirizzipartenza',
    handler: function(request,reply){
        var conn=new Connection(config);
        conn.on('connect',function(err){
            if(err)
            console.log(err);
            else{
                console.log('Database connected');
                RicercaIndirizziPartenza(reply,conn,request.query.linea)
            }
        });
    }
});

server.start(function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Server is running on : ' + server.info.uri);
});




function Esegui(conn, reply) {
    var righe = [];
    var request = new Request('SELECT * FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzi AS I ON LI.Id_Indirizzo=I.Id_Indirizzo', function (err, rowcount) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rowcount + ' Rows');
            reply(righe);
            console.log(righe);
        }
    });
    request.on('row', function (columns) {
        riga = {};
        columns.forEach(function (column) {
            riga[column.metadata.colName] = column.value;
        });
        righe.push(riga);

    });
    conn.execSql(request);
}


function Selezione_Linea(reply,conn,indirizzo)
{
    var righe=[];
    var riga={};
var request=new Request("SELECT L.Id_Linea FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzi AS I ON LI.Id_Indirizzo=I.Id_Indirizzo WHERE I.Indirizzo LIKE '%'+@indirizzo+'%'",function(err,rowcount){
    if(err)
    console.log(err)
    else{
        console.log(rowcount+' rows');
        reply(righe);
    }
});
request.addParameter('indirizzo',TYPES.VarChar,indirizzo);
request.on('row',function(columns){
    riga={};
    columns.forEach(function(column){
        riga[column.metadata.colName]=column.value;
    })
    righe.push(riga);
});
conn.execSql(request);
}

function RicercaIncroci(reply,conn,id1,id2){
    var righe=[];
    var riga={};
    var request=new Request('SELECT I.Indirizzo FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzi AS I ON LI.Id_Indirizzo=I.Id_Indirizzo WHERE L.Id_Linea=@id1 OR L.Id_Linea=@id2 GROUP BY I.Indirizzo HAVING COUNT(I.Indirizzo)>=2',function(err,rowcount){
        if(err){
            console.log(err);
        }
        else{
            console.log(rowcount+' rows');
            reply(righe);
        }
    });
    request.addParameter('id1',TYPES.Int,id1);
    request.addParameter('id2',TYPES.Int,id2);
    request.on('row',function(columns){
        riga={};
        columns.forEach(function(column){
            riga[column.metadata.colName]=column.value;
        })
        righe.push(riga);
    });
    conn.execSql(request);
}


function RicercaIndirizziPartenza(reply,conn,linea)
{
    var riga={};
    var righe=[];
    var request=new Request('SELECT I.Indirizzo FROM Linee AS L INNER JOIN Linea_Indirizzo AS LI ON L.Id_Linea=LI.Id_Linea INNER JOIN Indirizzi AS I ON LI.Id_Indirizzo=I.Id_Indirizzo WHERE L.Id_Linea=@id',function(err,rowcount){
if(err)
console.log(err);
else{
    console.log(rowcount+' rows');
    reply(righe);
}
request.addParameter('id',TYPES.Int,linea);
    });
    request.on('row',function(columns){
        riga={};
        columns.forEach(function(column){
            riga[column.metadata.colName]=column.value;
        })
        righe.push(riga);
    });
    conn.execSql(request);
}
