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
            const id = req.params.id;
            const existing = await UserModel.getById(id);
            if (!existing) return res.status(404).json({ error: 'User not found' });

            // Build a partial update object from provided fields only
            const body = req.body || {};

            const updatedUser = {};

            if (Object.prototype.hasOwnProperty.call(body, 'name')) updatedUser.name = body.name;
            if (Object.prototype.hasOwnProperty.call(body, 'email')) updatedUser.email = body.email;
            if (Object.prototype.hasOwnProperty.call(body, 'address')) updatedUser.address = body.address;
            if (Object.prototype.hasOwnProperty.call(body, 'city')) updatedUser.city = body.city;
            if (Object.prototype.hasOwnProperty.call(body, 'state_province')) updatedUser.state_province = body.state_province;
            if (Object.prototype.hasOwnProperty.call(body, 'postal_code')) updatedUser.postal_code = body.postal_code;
            if (Object.prototype.hasOwnProperty.call(body, 'country')) updatedUser.country = body.country;

            if (Object.prototype.hasOwnProperty.call(body, 'password')) {
                const password = body.password;
                if (!PASSWORD_REGEX.test(password)) {
                    return res.status(400).json({
                        error: 'Password must be at least 8 characters long and include at least one uppercase letter and one number.'
                    });
                }
                updatedUser.password = await bcrypt.hash(password, 10);
            }
            const affected = await UserModel.updateUser(id, updatedUser);
            if (!affected) return res.status(404).json({ error: 'User not found' });

            // fetch and return the updated user (omit password)
            const newUser = await UserModel.getById(id);
            const safeUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                address: newUser.address,
                city: newUser.city,
                state_province: newUser.state_province,
                postal_code: newUser.postal_code,
                country: newUser.country,
            };

            res.json({ message: 'User updated successfully', user: safeUser });
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