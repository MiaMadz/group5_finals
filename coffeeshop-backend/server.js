const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const cafeRoutes = require('./routes/cafeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cafes', cafeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

async function ensureCafeSchema() {
    try {
        const requiredColumns = [
            { name: 'directions_url', ddl: "ADD COLUMN directions_url varchar(255) DEFAULT NULL" },
            { name: 'is_user_shop', ddl: "ADD COLUMN is_user_shop tinyint(1) NOT NULL DEFAULT 0" },
            { name: 'business_permit_name', ddl: "ADD COLUMN business_permit_name varchar(255) DEFAULT NULL" },
        ];

        for (const column of requiredColumns) {
            const [rows] = await db.query(`SHOW COLUMNS FROM cafes_tbl LIKE ?`, [column.name]);
            if (rows.length === 0) {
                console.log(`Adding missing column ${column.name} to cafes_tbl`);
                await db.query(`ALTER TABLE cafes_tbl ${column.ddl}`);
            }
        }
    } catch (err) {
        console.error('Failed to ensure cafe schema:', err);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 5000;

ensureCafeSchema().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});