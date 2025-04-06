const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const dockerService = require('../services/dockerService');


exports.runCode = async (req, res, next) => {
  try {
    const { code, language, problemId, input } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const result = await dockerService.runCode(
      code,
      language,
      input || problem.sampleInput,
      problem.timeLimit,
      problem.memoryLimit
    );
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language, problemId } = req.body;
    const userId = req.userId; 
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    const testResults = await dockerService.testCodeAgainstCases(
      code,
      language,
      problem.testCases,
      problem.timeLimit,
      problem.memoryLimit
    );
    

    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: testResults.overall,
      runTime: Math.max(...testResults.results.map(r => r.executionTime)),
      testCasesPassed: testResults.testCasesPassed,
      totalTestCases: testResults.totalTestCases,
      stderr: testResults.results.find(r => r.stderr)?.stderr || '',
      stdout: testResults.results.find(r => r.status === 'Accepted')?.stdout || ''
    });
    
    await submission.save();
    
    res.status(200).json({
      submission: submission._id,
      status: testResults.overall,
      results: testResults.results.map(r => ({
        status: r.status,
        executionTime: r.executionTime,
        passed: r.passed,
        ...(r.testCase.input !== '(hidden)' ? {
          input: r.testCase.input,
          expectedOutput: r.testCase.expectedOutput,
          stdout: r.stdout
        } : {})
      })),
      testCasesPassed: testResults.testCasesPassed,
      totalTestCases: testResults.totalTestCases
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubmissionsForProblem = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId; 
    
    const submissions = await Submission.find({ 
      problemId,
      ...(userId ? { userId } : {})
    })
    .sort({ createdAt: -1 })
    .select('-code'); 
    
    res.status(200).json(submissions);
  } catch (err) {
    next(err);
  }
};