var app = require('./config.js');
const pgp = require('pg-promise')();

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'news',
    user:'postgres',
    password: '1234'
}

var db = pgp(cn);

function selectAll(){
    return db.any('SELECT * FROM news');
}

function insertNews(news){
    pgp.helpers.insert(news, null, 'news');
}

function getNews(nome){
    return db.any('SELECT * FROM news WHERE title like $1', [nome]);
}

function postUsuario(usuario){
    // return db.one("INSERT INTO usuarios(name, email, password) VALUES($1, $2, crypt($3, gen_salt('bf'))",[name, email, password]);
    pgp.helpers.insert(usuario,['name', 'email','password'], 'usuarios');

}

function getUsuarios(){
    return db.any('SELECT * FROM usuarios');
}

function Usuario(senha, email){
    db.one('SELECT password FROM usuarios WHERE email == $1', [email])
    .then((password) => {
        return db.any('SELECT * FROM ususarios WHERE email = $1 AND password = crypt($1, $2)' ,[email,senha, password]);
    })
    .catch(() => {
        console.log('Error when try to get the user in system');
    })
    
}

function ByCategoria(categoria){
    return db.any('SELECT * FROM news WHERE categoria = $1',[categoria]);
}



app.get('/news', function(req, res){
        selectAll()
        .then((news) =>{
            res.status(200).json(news); 
        })
        .catch((err) => {
            console.log(err);
        });
}); 


app.get('/news/:nome', function(req, res){
    
    getNews(req.params.nome)
    .then((news) => {
        res.status(200).json(news);
    })
    .catch((err) => {
        res.status(404).json("Not found");
    });

});

app.post('/news/', (req, res) => {
    console.log(req.body);

    insertNews(req.body.news);
    res.status(201).json('ok');
    res.status(500);
    

});

//categoria

app.get('/categoria/:categoria', function(req, res){
    ByCategoria(req.params.categoria)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(()=>{
        console.log('Error with categorias');
    });
});

// usuarios
app.get('/usuarios', function(req, res){
    getUsuarios()
    .then((usuario)=>{
        res.status(200).json(usuario);
    })
    .catch((erro)=>{
        res.status(404).send('Not Found');
    })
});

app.post('post/usuarios/', function(req, res){
    
    var password = req.body.password;
    var email = req.body.email;
    
    Usuario(password, email)
    .then((usuario) => {
        res.json(usuario);
    })
    .catch(() => {
        console.log('Error with authentication');
    })

});

app.post('/usuario', (req, res) =>{
    console.log(req.body);

    postUsuario(req.body.usuario)
    
    res.status(201).json('Created');

});