import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export const UpdateServiceSuccess = ({ show, onClose, action }) => {


  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{action} Successful</Modal.Title>
      </Modal.Header>
      {/* <Modal.Body>
        <p>Add Services successful.</p>
      </Modal.Body> */}
      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
