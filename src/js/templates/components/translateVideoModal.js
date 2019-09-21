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
                    <Modal.Title><h1>How To Translate LGCU Website Using <span className="highlight"><i className="fab fa-chrome"></i> Google Chrome </span></h1></Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <div className="translate-instructions">
                        <p>Turn on <span className="highlight"><i className="fab fa-chrome"></i> Google Chrome</span> Translation:</p>
                        <ol>
                            <li>On your computer, open the <span className="highlight"><i className="fab fa-chrome"></i> Google Chrome</span> Browser.</li>
                            <li>At the top right, click <span className="highlight"><i className="fas fa-ellipsis-v"></i></span> then Settings</li>
                            <li>At the bottom, click <span className="highlight">Advanced</span></li>
                            <li>Under <span className="highlight">"Languages"</span> click Language.</li>
                            <li>Check or uncheck <span className="highlight">"Offer to translate pages that aren't in a language you read."</span></li>
                            <li>Close the browser</li>
                            <li>Reopen the browser & try steps in video below</li>
                        </ol>
                        <p>Translate Webpage:</p>
                    </div>                  
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