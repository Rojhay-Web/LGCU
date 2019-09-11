import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';


/* Body */
class TranslateVideo extends Component{
    constructor(props) {
        super(props);
        this.state = {}   
                
        this.closeForm = this.closeForm.bind(this);
    }
    
    
    closeForm(){ this.props.handleClose();}

    componentDidMount(){}

    
    render(){           
        return(
            <Modal dialogClassName="lgcuModal translateModal" show={this.props.show} size="lg" onHide={this.closeForm}>
                <Modal.Header closeButton>
                    <Modal.Title>How To Translate LGCU Website Using Google Chrome</Modal.Title>
                </Modal.Header>
                <Modal.Body>                   
                    <video className="translateVideo" alt="Home back video" controls muted>
                        <source src="../images/site/translateSite.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Modal.Body>               
            </Modal>
        );
    }  
}

export default TranslateVideo;