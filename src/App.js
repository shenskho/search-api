import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Form, InputGroup, Button, Card, Pagination, Spinner } from 'react-bootstrap';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searched, setSearched] = useState(false);
  
  const universitiesPerPage = 5;
  
  const searchUniversities = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const response = await axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
      setUniversities(response.data);
      setCurrentPage(1);
    } catch (err) {
      setError('Error fetching universities. Please try again.');
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    searchUniversities();
  };
  
  // Pagination logic
  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = universities.slice(indexOfFirstUniversity, indexOfLastUniversity);
  const totalPages = Math.ceil(universities.length / universitiesPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <Container className="app-container">
      <div className="search-header">
        <h1>University Search</h1>
        <p>Search for universities around the world</p>
      </div>
      
      <Form onSubmit={handleSubmit} className="search-form">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Enter university name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <i className="bi bi-search me-1"></i> Search
          </Button>
        </InputGroup>
      </Form>
      
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      
      {!loading && searched && universities.length === 0 && (
        <div className="alert alert-info mt-3">No universities found. Try a different search term.</div>
      )}
      
      {!loading && universities.length > 0 && (
        <div className="results-container">
          <p className="results-count">Found {universities.length} results</p>
          
          {currentUniversities.map((university, index) => (
            <Card key={index} className="university-card">
              <Card.Body>
                <Card.Title>{university.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{university.country}</Card.Subtitle>
                <div className="university-details">
                  <div>
                    <strong>State/Province:</strong> {university["state-province"] || 'N/A'}
                  </div>
                  <div className="website-link">
                    {university.web_pages && university.web_pages.length > 0 ? (
                      <a href={university.web_pages[0]} target="_blank" rel="noopener noreferrer">
                        Visit Website <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    ) : 'No website available'}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
          
          {universities.length > universitiesPerPage && (
            <Pagination className="pagination-container">
              <Pagination.Prev 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              
              {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </div>
      )}
      
      <footer className="footer">
        <p>created by Seyed Amirhossein Gholampour</p>
      </footer>
    </Container>
  );
}

export default App;
