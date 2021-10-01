const { Router } = require('express');
const authController = require('./authController');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMidlleware = require('./middlewares/roleMiddleware');
const router = new Router();

router.post('/reg', authController.registration);
router.post('/login', authController.login);
router.get('/users',roleMidlleware(["ADMIN"]), authController.getUsers);

module.exports = router;
