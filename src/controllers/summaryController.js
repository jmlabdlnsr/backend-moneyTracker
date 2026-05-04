const pool = require('../config/db');
require('dotenv').config();

const getSummary = async (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  try {
    const connection = await pool.getConnection();

    // Filter by month
 and year if provided, otherwise overall
    let dateFilter = '';
    const params = [userId];
    if (month && year) {
      dateFilter = ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(month, year);
    }

    // Total Income & Expense
    const [totals] = await connection.query(
      `SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions 
      WHERE user_id = ? ${dateFilter}`,
      params
    );

    // Expense by Category
    const [categoryExpenses] = await connection.query(
      `SELECT 
        c.name as category_name,
        SUM(t.amount) as total_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense' ${dateFilter.replace('date', 't.date')}
      GROUP BY c.id, c.name`,
      params
    );

    connection.release();

    res.json({
      summary: totals[0],
      categories: categoryExpenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSummary };
