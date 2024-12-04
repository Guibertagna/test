import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button, Container, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { retriveNumbers, deleteNumber, addNumber, updateNumberAction } from './ducks/numbersSlice';
import InputMask from 'react-input-mask';

function App() {
  const dispatch = useDispatch();
  const { isLoading, isError, items: numbersSlice } = useSelector(state => state.numbersSlice);

  const [newNumber, setNewNumber] = useState({
    value: '',
    monthlyPrice: '',
    setupPrice: '',
    currency: 'U$',
  });

  const [editingNumber, setEditingNumber] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const numbersPerPage = 100;

  useEffect(() => {
    dispatch(retriveNumbers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete number with ID ${id}?`)) {
      dispatch(deleteNumber(id));
    }
  };

  const handleAddNumber = () => {
    if (newNumber.value && newNumber.monthlyPrice && newNumber.setupPrice) {
      dispatch(addNumber(newNumber));
      setNewNumber({ value: '', monthlyPrice: '', setupPrice: '', currency: 'U$' });
    } else {
      alert('Please enter a valid phone number and fill all fields.');
    }
  };

  const handleEditNumber = (number) => {
    window.scrollTo(0, 0);
    setEditingNumber(number);
    setNewNumber({
      value: number.value,
      monthlyPrice: number.monthlyPrice,
      setupPrice: number.setupPrice,
      currency: number.currency,
    });
  };

  const handleSaveEdit = () => {
    if (editingNumber) {
      dispatch(updateNumberAction({
        ...editingNumber,
        value: newNumber.value,
        monthlyPrice: newNumber.monthlyPrice,
        setupPrice: newNumber.setupPrice,
        currency: newNumber.currency,
      }));
      setEditingNumber(null);
      setNewNumber({ value: '', monthlyPrice: '', setupPrice: '', currency: 'U$' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNumber(null);
    setNewNumber({ value: '', monthlyPrice: '', setupPrice: '', currency: 'U$' });
  };

  const indexOfLastNumber = currentPage * numbersPerPage;
  const indexOfFirstNumber = indexOfLastNumber - numbersPerPage;
  const currentNumbers = numbersSlice.slice(indexOfFirstNumber, indexOfLastNumber);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(numbersSlice.length / numbersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container className="main-container text-center align-items-center">
      <h1 className="title">Manage Your Numbers</h1>

      {isLoading && (
        <div className="spinner-container text-center align-items-center">
          <Spinner animation="border" variant="warning" />
          <p>Loading numbers...</p>
        </div>
      )}

      {isError && (
        <Alert variant="danger" className="error-alert text-center align-items-center">
          An error occurred while fetching the numbers. Please try again later.
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <Form className="number-form">
            <Row className="mb-4">
              <Col className="mb-3 mb-sm-0">
                <Form.Label>Phone Number</Form.Label>
                <InputMask
                  mask="+55 99 9999-99999"
                  value={newNumber.value}
                  onChange={(e) => setNewNumber({ ...newNumber, value: e.target.value })}
                  placeholder="ex: +55 43 9966-5590"
                  className="form-control form-control-custom text-center"
                />
              </Col>
              <Col className="mb-3 mb-sm-0">
                <Form.Label>Monthly price</Form.Label>
                <InputMask
                  mask="9.99"
                  value={newNumber.monthlyPrice}
                  onChange={(e) => setNewNumber({ ...newNumber, monthlyPrice: e.target.value })}
                  placeholder="ex: 0.04"
                  className="form-control form-control-custom text-center"
                />
              </Col>
              <Col className="mb-3 mb-sm-0">
                <Form.Label>Setup price</Form.Label>
                <InputMask
                  mask="9.9"
                  placeholder="ex: 4.5"
                  value={newNumber.setupPrice}
                  onChange={(e) => setNewNumber({ ...newNumber, setupPrice: e.target.value })}
                  className="form-control form-control-custom text-center"
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col className="d-flex justify-content-center">
                {editingNumber ? (
                  <>
                    <Button variant="warning" onClick={handleSaveEdit} className="add-button w-50">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit} className="add-button w-50 ms-2">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="warning" onClick={handleAddNumber} className="add-button w-50">
                    Add Number
                  </Button>
                )}
              </Col>
            </Row>
          </Form>

          <hr />

          <Row className="fw-bold text-center mb-3">
            <Col>ID</Col>
            <Col>Number</Col>
            <Col>Monthly Price</Col>
            <Col>Setup Price</Col>
            <Col>Currency</Col>
            <Col>Actions</Col>
          </Row>

          {currentNumbers.map((number) => (
            <Row key={number.id} className="align-items-center mb-2 text-center">
              <Col>{number.id}</Col>
              <Col>{number.value}</Col>
              <Col>{number.monthlyPrice}</Col>
              <Col>{number.setupPrice}</Col>
              <Col>{number.currency}</Col>
              <Col>
                <Button variant="danger" size="sm" onClick={() => handleDelete(number.id)} className="delete-button">
                  Delete
                </Button>
                <Button 
                  variant="warning" 
                  size="sm" 
                  onClick={() => handleEditNumber(number)} 
                  className="edit-button ms-3"
                >
                  Edit
                </Button>
              </Col>
            </Row>
          ))}

          <Row className="pagination-row justify-content-center mt-4">
            {pageNumbers.map(number => (
              <Button
                key={number}
                variant={number === currentPage ? "primary" : "outline-secondary"}
                className="btn-sm mx-1 pagination-btn"
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
