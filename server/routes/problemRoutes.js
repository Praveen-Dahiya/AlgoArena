const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

// Get all problems (with pagination)
router.get('/', problemController.getProblems);

// Get a single problem by slug
router.get('/:slug', problemController.getProblemBySlug);

// Admin routes
router.post('/', problemController.createProblem);
router.put('/:id', problemController.updateProblem);
router.delete('/:id', problemController.deleteProblem);

module.exports = router;