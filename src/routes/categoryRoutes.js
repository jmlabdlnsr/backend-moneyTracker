const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getCategories);
router.post('/', createCategory);

module.exports = router;
