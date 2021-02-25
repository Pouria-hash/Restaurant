if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express();
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const MongoStore = require('connect-mongo')(session)

const User = require('./models/users');


const secret = process.env.SECRET


const userRouter = require('./router/userRouter');
const foodRouter = require('./router/foodRouter');
const paymentRouter = require('./router/paymentRouter')
const bookingRouter = require('./router/bookingRouter')
const userAdminRouter = require('./router/userAdminRouter')
const foodAdminRouter = require('./router/foodAdminRouter')
const orderAdminRouter = require('./router/orderAdminRouter')

mongoose.connect('mongodb://localhost:27017/E-Restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('Mongo cenetction open')
    })
    .catch((err) => {
        console.log('oh no Mongo error!!', err)
    })

app.engine('ejs', engine)
app.set('view engine', "ejs")
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

const store = new MongoStore({
    url: "mongodb://localhost:27017/E-Restaurant",
    secret: secret,
    touchAfter: 24 * 60 * 60
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

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use(userRouter)
app.use('/foods', foodRouter)
app.use(paymentRouter)
app.use(bookingRouter)
app.use('/admin', userAdminRouter)
app.use('/admin/foods', foodAdminRouter)
app.use('/admin/orders', orderAdminRouter)

app.get('/', (req, res) => {
    res.render('home')
})

app.use('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Invalid data'
    res.status(status).render('error', { err })
})



app.listen(3000, () => {
    console.log('listening on port 3000')
})

