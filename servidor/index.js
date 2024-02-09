const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const mysql = require('mysql')
const { error } = require('console')
app.use(express.json())
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loja_pratas'
})

db.connect((err) => {
    if (err) throw err;
    console.log("Conectado ao banco de dados")
})

app.use(session({
    secret: 'seu segredo aqui',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    if (!req.session.user) {
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


app.get('/', async (req, res) => {
    const produtos = await buscarProduto()
    req.session.cart = req.session.cart || [];
    req.session.produtos = produtos
    res.render('index.ejs', {
        produtos: produtos,
        user: req.session.user,
        cart: req.session.cart
    })
})

async function buscarProduto() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tabela_produtos", async (err, resultado) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(resultado)
            }

        })
    })

}

router.get('/login', function (req, res) {
    res.render('login.ejs')
})


router.post('/login', function (req, res) {
    const { email, senha } = req.body
    console.log(email, senha)

    db.query('SELECT email, senha FROM tabela_login WHERE email = ?', [email], async (err, resultado) => {
        if (err) {
            console.log(err)
        } else if (resultado.length === 0) {
            console.log("credencias invalidas")
        } else {
            const senhaCorreta = await bcrypt.compare(senha, resultado[0].senha)
            if (senhaCorreta) {
                db.query('SELECT nome FROM tabela_login WHERE email = ?', [email], async (err, resultado) => {
                    console.log("Deu bom")
                    req.session.user = resultado[0].nome
                    return res.redirect("/")
                })

            } else {
                console.log("deu erro na senha provavel")
            }
        }
    })
})

router.get('/registrar', function (req, res) {
    res.render('registrar.ejs')
})


router.post('/registrar', function (req, res) {
    const { nome, email, senha } = req.body

    db.query('SELECT email FROM tabela_login WHERE email = ?', [email], async (err, resultado) => {
        if (err) {
            console.log(err)
        }

        if (resultado.length > 0) {
            console.log(resultado)

            return res.render('registrar')
        }

        let encriptar = await bcrypt.hash(senha, 8)

        db.query('INSERT INTO tabela_login (nome, email, senha) VALUES (?, ?, ?)', [nome, email, encriptar], (err, resultado) => {
            if (err) {
                console.log(err)
            } else {
                return res.render('registrar', {
                    message: 'Usuario registrado'
                })
            }
        })
    })

})

app.post('/paginaProduto', function (req, res) {
    const produtos = req.body
    res.render('paginaProduto.ejs', {
        produtos: produtos,
        user: req.session.user,
        cart: req.session.cart
    })
})

app.post('/adicionar-carrinho', function (req, res) {
    const produtos = req.body

    if (req.session.cart) {
        let produtoExistente = false;
        for (let i = 0; i < req.session.cart.length; i++) {
            if (req.session.cart[i].titulo == produtos.titulo){
                req.session.cart[i].quantidade +=1
                produtoExistente = true;
                
            }
        }
        if (!produtoExistente) {
            produtos.quantidade = 1
            req.session.cart.push(produtos);
        }
    } else {
        produtos.quantidade = 1
        req.session.cart = [produtos];
    }

    for (let i=0; i<req.session.cart.length;i++){
        req.session.cart[i].total = req.session.cart[i].quantidade * req.session.cart[i].precos
    }

    console.log('req.session.cart:', req.session.cart)
    req.session.produtos = produtos
    res.render('paginaProduto', {
        user: req.session.user,
        cart: req.session.cart,
        produtos: produtos,
    })
})

app.post('/atualizar-carrinho', function(req, res){
    const { action, titulo, tituloRemover} = req.body
    const produtos = req.session.produtos
    console.log(tituloRemover)

    for (let i=0;i<req.session.cart.length;i++){
        if (req.session.cart[i].titulo == titulo || tituloRemover){
            console.log("entrou clicando remover")
            if (action == 'plus'){
                req.session.cart[i].quantidade +=1
    
            }else if(action == 'minus'){
                req.session.cart[i].quantidade -=1
            }
            
            if (req.session.cart[i].quantidade ==0 || req.session.cart[i].titulo == tituloRemover){
                req.session.cart.splice(i,1)
                i--
            }else{
                req.session.cart[i].total = req.session.cart[i].quantidade * req.session.cart[i].precos 
            }
        }    
              
    }

    res.render('paginaProduto',{
        user:req.session.user,
        cart:req.session.cart,
        produtos: produtos,

    }) 
})

app.get('/total', function(req, res){
    let total = 0
    for (let i=0; i<req.session.cart.length;i++){
        total += req.session.cart[i].total
    }

    res.json({ total: total})
})


app.get('/minhaConta/pedidos', function(req, res){

    res.render('minhaConta/pedidos.ejs',{
        user: req.session.user,
        cart:req.session.cart
    })
})

app.get('/minhaConta/meusDados', function(req, res){

    res.render('minhaConta/meusDados.ejs',{
        user: req.session.user,
        cart:req.session.cart
    })
})

app.get('/sair', function(req, res){

    produtos = req.session.produtos
    res.render('index.ejs',{
        user: req.session.user = null,
        cart:req.session.cart,
        produtos: produtos
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server rodando")
})


