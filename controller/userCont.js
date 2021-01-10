const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('user/register')
}

module.exports.creatNewUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'You are LogIn')
            res.redirect('/campground')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'You are Log In')
    const redirectUrl = req.session.returnUrl || '/campground'
    delete req.session.returnUrl
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'GoodBye')
    res.redirect('/campground')
}