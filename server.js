const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodeproj')
let db = mongoose.connection;
db.on('error', (error) => {
    console.log(error)
})

db.once('open', () => {
    console.log('contected to mango')
})

//init app
const app = express();
//Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


//set public folder
app.use(express.static(path.join(__dirname, 'public')))


let Article = require('./models/article')

//load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


//start server in port 3002
app.listen(3002, () => {
    console.log('Hello Word')
})

//get single article

app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article

        })

    })
})

//Load edit form

app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article

        })

    })
})


//update submit
app.post('/articles/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = { _id: req.params.id }
    Article.update(query, article, (err) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})


//delete
app.delete('/article/:id', (req, res) => {
    let query = { _id: req.params.id }
    Article.remove(query, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send('Successful')
        }
    })
})

//Home route
app.get('/', ((req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: "Articles",
                articles: articles
            })
        }
    })
}))

//Add submit POST route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if (err) {
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})

app.get('/articles/add', ((req, res) => {

    res.render('add_article', {
        title: "Add Article",

    })
}))


