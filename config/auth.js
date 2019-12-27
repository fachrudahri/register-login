module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }
        if(!req.isAuthenticated()) {
            res.redirect('/users/login')
        }
        req.flash('error_msg', 'Please log in to view this resource')
        res.redirect('/users/login')
    }
}