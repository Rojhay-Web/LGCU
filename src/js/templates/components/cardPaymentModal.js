import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

/* Body */
class CardPayment extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardDisplayNum: "1000200030004000",
            cardNum:"",
            cardExpMth:"01",
            cardExpYr:"22",
            cardName:"Thomas J. James",
            cardCSV:""
        }   
        
        this.onElementChange = this.onElementChange.bind(this);
    }
    onElementChange(event){
        var self = this;
        try {
           var name = event.target.name;

            if(name in this.state) {
                self.setState({ [name]:event.target.value });
            }
        }
        catch(ex){

        }
    }
    render(){        
        return(
            <Modal dialogClassName="lgcuModal" show={this.props.show} backdrop="static" size="lg" onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="card-payment-container">
                        <div className="details-container card-details">
                            <p className="description">Your student application will not be processed until your student application fee is submitted.  Please submit your student application fee online using either your application ID provided after your online application was submitted or the name used on your student application.</p>
                            <div className="card-form">
                                <div className="form-container">
                                    <div className="card-display">
                                        <div className="card-number">
                                            <span>{this.state.cardDisplayNum.substring(0, 4)}</span>
                                            <span>{this.state.cardDisplayNum.substring(4, 8)}</span>
                                            <span>{this.state.cardDisplayNum.substring(8, 12)}</span>
                                            <span>{this.state.cardDisplayNum.substring(12, 16)}</span>
                                        </div>
                                        <div className="card-exp">
                                            <span className="title">Exp</span>
                                            <span>{this.state.cardExpMth}</span>
                                            <span>/</span>
                                            <span>{this.state.cardExpYr}</span>
                                        </div>
                                        <div className="card-name">
                                            <span>{this.state.cardName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-container fill">
                                    <div className="form-section-container">
                                        <div className="form-element sz-10"><span>Name On Card</span><input type="text" name="cardName" className="" placeholder="Name on card" value={this.state.cardName} onChange={(e) => this.onElementChange(e)}/></div>
                                        <div className="form-element sz-10"><span>Card Number</span><input type="text" name="cardNum" className="" placeholder="" value={this.state.cardNum} onChange={(e) => this.onElementChange(e)}/></div>

                                        <div className="form-element sz-3"><span>Exp Month</span>
                                            <select name="cardExpMth" className="" value={this.state.cardExpMth} onChange={(e) => this.onElementChange(e)}>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                        <div className="form-element sz-3"><span>Exp Year</span>
                                            <select name="cardExpYr" className="" value={this.state.cardExpYr} onChange={(e) => this.onElementChange(e)}>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                        <div className="form-element sz-4"><span>Card CSV</span><input type="text" name="cardCSV" className="" placeholder="" value={this.state.cardCSV} onChange={(e) => this.onElementChange(e)}/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="details-container payment-details"></div>
                    </div>
                </Modal.Body>
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