const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {key} = require('./config');

function generateAccessToken(id, roles) {
    const payload = { id, roles };
    return jwt.sign(payload,key,{expiresIn:'24h'});
}

class authController {
    async registration(req, res) {
        try {
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: 'This username already exist' });
            }
            const hashPw = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'ADMIN' });//поставить нужную роль
            console.log(userRole.value);
            const user = new User({ username, password: hashPw, roles: [userRole.value] });
            await user.save();
            return res.json({ message: 'User successfuly created!' });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username:username });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            const token = generateAccessToken(user._id,user.roles);
            return res.json({token});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'error' });
        }
    }
}

module.exports = new authController();
