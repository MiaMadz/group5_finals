const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

class UserController {
    static async signup(req, res) {
        try {
            const { name, email, password, address, city, state_province, postal_code, country } = req.body;

            if (!PASSWORD_REGEX.test(password)) {
                return res.status(400).json({
                    error: 'Password must be at least 8 characters long and include at least one uppercase letter and one number.'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await UserModel.createUser({
                name, email,
                password: hashedPassword,
                address, city, state_province, postal_code, country
            });

            res.json({ message: 'Account created successfully' });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findUserByEmail(email);

            if (!user) return res.status(404).json({ error: 'User not found' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: 'Incorrect password' });

            res.json({ 
                message: 'Login successful', 
                user: { id: user.id, name: user.name, email: user.email } 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const user = await UserModel.getById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const affected = await UserModel.updateUser(req.params.id, req.body);
            if (!affected) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const affected = await UserModel.deleteUser(req.params.id);
            if (!affected) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = UserController;