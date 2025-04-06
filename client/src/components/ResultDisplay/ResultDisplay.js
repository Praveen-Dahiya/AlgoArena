import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result }) => {
  if (!result) {
    return (
      <div className="result-display card">
        <div className="card-header">Result</div>
        <div className="card-body text-center text-muted">
          <p>Run your code to see results</p>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-success';
      case 'Wrong Answer':
        return 'text-danger';
      case 'Runtime Error':
      case 'Compilation Error':
        return 'text-warning';
      case 'Time Limit Exceeded':
        return 'text-info';
      default:
        return '';
    }
  };

  return (
    <div className="result-display card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Result</span>
        <span className={getStatusClass(result.status)}>
          <strong>{result.status}</strong>
        </span>
      </div>
      <div className="card-body">
        {result.executionTime && (
          <div className="mb-2">
            <small>Execution Time: {result.executionTime} ms</small>
          </div>
        )}
        
        {/* For single run */}
        {result.stdout && (
          <div className="output-section">
            <h6>Output:</h6>
            <pre className="bg-light p-2 rounded">{result.stdout}</pre>
          </div>
        )}
        
        {result.stderr && (
          <div className="error-section">
            <h6>Errors:</h6>
            <pre className="bg-light p-2 rounded text-danger">{result.stderr}</pre>
          </div>
        )}
        
        {/* For test case results */}
        {result.results && (
          <div className="test-results">
            <h6>Test Results:</h6>
            <div className="test-summary mb-2">
              <span className={result.overall === 'Accepted' ? 'text-success' : 'text-danger'}>
                {result.testCasesPassed} / {result.totalTestCases} test cases passed
              </span>
            </div>
            
            {result.results.map((testResult, index) => (
              <div key={index} className="test-case mb-3">
                <div className="test-case-header d-flex justify-content-between">
                  <span>Test Case {index + 1}</span>
                  <span className={testResult.passed ? 'text-success' : 'text-danger'}>
                    {testResult.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                
                {testResult.input !== '(hidden)' && (
                  <>
                    <div className="test-input mt-1">
                      <small className="text-muted">Input:</small>
                      <pre className="bg-light p-1 rounded small">{testResult.input}</pre>
                    </div>
                    
                    <div className="test-expected mt-1">
                      <small className="text-muted">Expected:</small>
                      <pre className="bg-light p-1 rounded small">{testResult.expectedOutput}</pre>
                    </div>
                    
                    <div className="test-output mt-1">
                      <small className="text-muted">Your Output:</small>
                      <pre className="bg-light p-1 rounded small">{testResult.stdout}</pre>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;