const router = require('express').Router();
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/auth')
const { protect } = require('../middlewares/auth')

// Register Route
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/forgotpassword/:resettoken', resetPassword);


module.exports = router;