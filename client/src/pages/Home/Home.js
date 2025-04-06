import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/problems?page=${page}`);
        setProblems(response.data.problems);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, [page]);
  
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-success';
      case 'Medium':
        return 'text-warning';
      case 'Hard':
        return 'text-danger';
      default:
        return '';
    }
  };
  
  if (loading) {
    return <div className="text-center my-5">Loading problems...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger my-5">{error}</div>;
  }
  
  return (
    <div className="problems-list">
      <h1 className="mb-4">Problems</h1>
      
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id}>
              <td>
                <Link to={`/problem/${problem.slug}`} className="problem-link">
                  {problem.title}
                </Link>
              </td>
              <td>
                <span className={getDifficultyClass(problem.difficulty)}>
                  {problem.difficulty}
                </span>
              </td>
              <td>
                {problem.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-1">{tag}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {problems.length === 0 && (
        <div className="alert alert-info">No problems found.</div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Problems pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
            </li>
            
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num} className={`page-item ${page === num + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPage(num + 1)}
                >
                  {num + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Home;