if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utility/ExpressError')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')(session)

const campgroundRouter = require('./router/campground')
const reviewsRouter = require('./router/reviews')
const userRouter = require('./router/user')

const dbUrl = process.env.DB_URL
const secret = process.env.SECRET
// 'mongodb://localhost:27017/Yelp-Camp'

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('Mongo cenetction open')
    })
    .catch((err) => {
        console.log('oh no Mongo error!!', err)
    })

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const store = new MongoStore({
    url:dbUrl, 
    secret: secret,
    touchAfter:24*60*60
})

store.on('error' , function (e) {
    console.log('session store error' , e)
})

const sessionConfig = {
    store,
    secret: secret,
    name: 'session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httponly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({ contentSecurityPolicy: false }))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.curentuser = req.user;
    next()
})

app.use('/campground', campgroundRouter)
app.use('/campground/:id/reviews', reviewsRouter)
app.use('/', userRouter)


app.get('/', (req, res) => {
    if (req.session.count) {
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    const count = req.session.count
    res.render('home', { count })
});

app.use('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Invalid data'
    console.log(err)
    res.status(status).render('error', { err })
});


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Sarving on Port ${port}`)
});