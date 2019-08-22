import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

/* Body */
class CardPayment extends Component{
    constructor(props) {
        super(props);
        this.state = {}       
    }
    render(){        
        return(
            <Modal dialogClassName="lgcuModal" show={this.props.show} backdrop="static" size="lg" onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Testing 12 Testing 34</Modal.Body>
                <Modal.Footer>
                    <div className="btn-container">
                        <div className="lBtn clear t1" onClick={this.props.handleClose}><span>Submit</span><i className="btn-icon far fa-credit-card"></i></div>
                        <div className="lBtn clear t1" onClick={this.props.handleClose}><span>Cancel</span><i className="btn-icon far fa-times-circle"></i></div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CardPayment;