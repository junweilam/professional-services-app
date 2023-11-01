import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export const TokenExpireModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Session have ended!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please Sign in again! :)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={onClose}>
            Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    )
}