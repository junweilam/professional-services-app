import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const UpdatePasswordSuccessModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Password Update Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your Password Update was successful.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          Sign In
        </Button>
      </Modal.Footer>
    </Modal>
  );
};