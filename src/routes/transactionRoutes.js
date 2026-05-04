const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth);

router.get('/', getTransactions);
router.post('/', upload.single('receipt_image'), createTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', upload.single('receipt_image'), updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
