const pool = require('../config/db');
require('dotenv').config();

const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  try {
    const connection = await pool.getConnection();
    
    let query = `
      SELECT t.*, c.name as category_name 
      FROM transactions t 
      JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (month && year) {
      query += ' AND MONTH(t.date) = ? AND YEAR(t.date) = ?';
      params.push(month, year);
    }

    query += ' ORDER BY t.date DESC';

    const [transactions] = await connection.query(query, params);
    connection.release();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  const { category_id, amount, type, description, date } = req.body;
  const userId = req.user.id;
  const receipt_image = req.file ? req.file.path : null;

  if (!category_id || !amount || !type || !date) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO transactions (user_id, category_id, amount, type, description, date, receipt_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, category_id, amount, type, description, date, receipt_image]
    );

    connection.release();
    res.status(201).json({
      message: 'Transaction created successfully',
      transactionId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const connection = await pool.getConnection();

    const [transactions] = await connection.query(
      'SELECT t.*, c.name as category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.id = ? AND t.user_id = ?',
      [id, userId]
    );
    connection.release();

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transactions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { category_id, amount, type, description, date } = req.body;
  const userId = req.user.id;
  const receipt_image = req.file ? req.file.path : undefined;

  try {
    const connection = await pool.getConnection();

    const [existing] = await connection.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Transaction not found' });
    }

    let query = 'UPDATE transactions SET category_id = ?, amount = ?, type = ?, description = ?, date = ?';
    const params = [category_id, amount, type, description, date];

    if (receipt_image !== undefined) {
      query += ', receipt_image = ?';
      params.push(receipt_image);
    }

    query += ' WHERE id = ? AND user_id = ?';
    params.push(id, userId);

    await connection.query(query, params);
    connection.release();
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
