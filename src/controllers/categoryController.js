const pool = require('../config/db');
require('dotenv').config();

const getCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const connection = await pool.getConnection();

    // Get user categories + default categories (where user_id is null)
    const [categories] = await connection.query(
      'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name ASC',
      [userId]
    );

    connection.release();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.id;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
      [userId, name, type]
    );

    connection.release();
    res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories, createCategory };

