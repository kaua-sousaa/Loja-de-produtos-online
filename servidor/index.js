const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const mysql =  require('mysql')
const { error } = require('console')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loja_pratas'
})

db.connect((err)=>{
    if(err) throw err;
    console.log("Conectado ao banco de dados")
})

app.use(session({
    secret: 'seu segredo aqui',
    resave: false,
    saveUninitialized:true
}))

app.use((req, res, next)=>{
    if (!req.session.user){
        req.session.user = null
    }
    next()
})



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'cliente')));
app.use('/', router)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/', async(req, res)=>{
   const produtos = await buscarProduto()
   
    res.render('index.ejs', {
         produtos: produtos,
         user: req.session.user
        })
})

async function buscarProduto(){
    return new Promise((resolve, reject)=>{
        db.query("SELECT * FROM tabela_produtos", async(err, resultado)=>{
            if (err){
                console.log(err)
                reject(err)
            }else{
                resolve(resultado)
            }
            
        })
    })
    
}

router.get('/login', function(req, res){
    res.render('login.ejs')
})


router.post('/login', function(req,res){
    const {email, senha} = req.body
    console.log(email, senha)
    
    db.query('SELECT email, senha FROM tabela_login WHERE email = ?', [email], async(err, resultado)=>{
        if(err){
            console.log(err)
        } else if (resultado.length === 0){
            console.log("credencias invalidas")
        } else{
            const senhaCorreta = await bcrypt.compare(senha, resultado[0].senha)
            if (senhaCorreta){
                db.query('SELECT nome FROM tabela_login WHERE email = ?', [email], async(err, resultado)=>{
                    console.log("Deu bom")
                    req.session.user = resultado[0].nome
                    return res.redirect("/")
                })
                         
            }else{
                console.log("deu erro na senha provavel")
            }
        }
    })
})

router.get('/registrar', function(req, res){
    res.render('registrar.ejs')
})


router.post('/registrar', function(req, res){
    const {nome, email, senha} = req.body

    db.query('SELECT email FROM tabela_login WHERE email = ?', [email], async (err, resultado) =>{
        if(err){
            console.log(err)
        }
        
        if (resultado.length > 0){
            console.log(resultado)
            
            return res.render('registrar')
        }

        let encriptar = await bcrypt.hash(senha, 8)

        db.query('INSERT INTO tabela_login (nome, email, senha) VALUES (?, ?, ?)', [nome, email, encriptar], (err, resultado)=>{
            if (err){
                console.log(err)
            }else{
                return res.render('registrar',{
                    message: 'Usuario registrado'
                })
            }
        })
    })

})

app.post('/paginaProduto', function(req, res){
    const produtos = req.body
    res.render('paginaProduto.ejs',{
        produtos: produtos,
        user:req.session.user
    })
})

app.post('/adicionar-carrinho', function(req, res){
    const produto = req.body
    
})



app.listen(process.env.PORT || 3000, () =>{
    console.log("Server rodando")
})
