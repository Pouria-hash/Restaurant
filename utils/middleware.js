const { userSchema } = require('./validateSchema')
const ExpressError = require('./ExpressError')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in')
        res.redirect('/login')
    } next()
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 500)

    } else {
        next()
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.flash('error', 'You must be Admin')
        res.redirect('/foods/:id')
    } next()
}