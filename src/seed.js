const pool = require('./config/db');
require('dotenv').config();

async function seedDefaultCategories() {
  const defaultCategories = [
    { name: 'Makanan & Minuman', type: 'expense' },
    { name: 'Transportasi', type: 'expense' },
    { name: 'Belanja', type: 'expense' },
    { name: 'Hiburan', type: 'expense' },
    { name: 'Kesehatan', type: 'expense' },
    { name: 'Gaji', type: 'income' },
    { name: 'Investasi', type: 'income' },
    { name: 'Lain-lain', type: 'income' },
    { name: 'Lain-lain', type: 'expense' },
  ];

  try {
    const connection = await pool.getConnection();

    for (const cat of defaultCategories) {
      // Check if already exists as default (user_id IS NULL)
      const [existing] = await connection.query(
        'SELECT * FROM categories WHERE name = ? AND type = ? AND user_id IS NULL',
        [cat.name, cat.type]
      );

      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO categories (name, type, user_id) VALUES (?, ?, NULL)',
          [cat.name, cat.type]
        );
      }
    }

    console.log('Default categories seeded successfully');
    connection.release();
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

module.exports = seedDefaultCategories;
