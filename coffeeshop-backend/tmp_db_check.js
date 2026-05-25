const db = require('./config/db');
(async () => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM cafes_tbl WHERE country = ?', ['Philippines']);
    console.log('countPhilippines:', rows[0]?.total);

    const [rows2] = await db.query('SELECT COUNT(*) AS total, country FROM cafes_tbl GROUP BY country ORDER BY total DESC');
    console.log('groupedCounts:');
    console.table(rows2);

    const [rows3] = await db.query("SELECT id,country,name FROM cafes_tbl WHERE country IS NULL OR TRIM(country) = '' OR country NOT LIKE 'Philippines' LIMIT 50");
    console.log('mismatched examples (country NULL/empty/other):');
    console.table(rows3);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
