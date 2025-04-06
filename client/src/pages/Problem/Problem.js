import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import ResultDisplay from '../../components/ResultDisplay/ResultDisplay';
import './Problem.css';

const Problem = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/problems/${slug}`);
        setProblem(response.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem. Please try again later.');
        if (err.response && err.response.status === 404) {
          setTimeout(() => navigate('/'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [slug, navigate]);
  
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  const handleRunCode = async (code) => {
    try {
      setProcessing(true);
      setResult(null);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submissions/run`, {
        code,
        language: 'cpp',
        problemId: problem._id,
        input: problem.sampleInput
      });
      
      setResult(response.data);
    } catch (err) {
      console.error('Error running code:', err);
      setError('Failed to run code. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleSubmitCode = async (code) => {
    try {
      setProcessing(true);
      setResult(null);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submissions/submit`, {
        code,
        language: 'cpp',
        problemId: problem._id
      });
      
      setResult(response.data);
    } catch (err) {
      console.error('Error submitting solution:', err);
      setError('Failed to submit solution. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return <div className="text-center my-5">Loading problem...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger my-5">{error}</div>;
  }
  
  if (!problem) {
    return <div className="alert alert-warning my-5">Problem not found.</div>;
  }
  
  return (
    <div className="problem-page">
      <div className="row">
        <div className="col-md-5">
          <div className="problem-details card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">{problem.title}</h2>
              <span className={`badge ${
                problem.difficulty === 'Easy' ? 'bg-success' : 
                problem.difficulty === 'Medium' ? 'bg-warning' : 
                'bg-danger'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="card-body">
              <div className="problem-description" 
                   dangerouslySetInnerHTML={{ __html: problem.description }}>
              </div>
              
              <div className="problem-examples mt-4">
                <h5>Example:</h5>
                <div className="example card bg-light">
                  <div className="card-body">
                    <div className="example-input mb-3">
                      <h6>Input:</h6>
                      <pre>{problem.sampleInput}</pre>
                    </div>
                    <div className="example-output">
                      <h6>Output:</h6>
                      <pre>{problem.sampleOutput}</pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="problem-constraints mt-4">
                <h5>Constraints:</h5>
                <ul>
                  <li>Time Limit: {problem.timeLimit}ms</li>
                  <li>Memory Limit: {problem.memoryLimit}MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-7">
          <CodeEditor 
            onCodeChange={handleCodeChange}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            isProcessing={processing}
          />
          
          <div className="mt-4">
            <ResultDisplay result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;