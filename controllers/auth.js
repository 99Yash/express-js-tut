exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
  });
};
