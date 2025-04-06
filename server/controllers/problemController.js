const Problem = require('../models/Problem');

exports.getProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const problems = await Problem.find({}, 'title slug difficulty tags')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Problem.countDocuments();
    
    res.status(200).json({
      problems,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProblems: total
    });
  } catch (err) {
    next(err);
  }
};

exports.getProblemBySlug = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    const filteredProblem = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden)
    };
    
    res.status(200).json(filteredProblem);
  } catch (err) {
    next(err);
  }
};

exports.createProblem = async (req, res, next) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
};

exports.updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

exports.deleteProblem = async (req, res, next) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (err) {
    next(err);
  }
};