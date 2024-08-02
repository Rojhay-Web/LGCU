import React, { Component } from 'react';

/* Payment Portal */
class PaymentPortal extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0); 
        
        let params = new URLSearchParams(this.props.location.search);
        let code = params.get("code");

        let bc = new BroadcastChannel("clover-payment");
        bc.onmessage = (e) => { 
            if(e.data?.key === 'close-payment-portal') { window.close(); }
        };
        bc.postMessage({key: 'request-code', value: code });

        bc.close();
        window.close();
    }

    render(){        
        return(
            <div className='portal-page'>
                <div className='loading-icon'>
                    <i className="loading fas fa-spinner fa-spin"></i>
                </div>
            </div>
        );
    }
}

/* Status Portal */
class PaymentStatusPortal extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0); 
        
        let payment_status = this.props.match.params.status;

        let bc = new BroadcastChannel("clover-payment");
        bc.onmessage = (e) => { 
            if(e.data?.key === 'close-payment-portal') { window.close(); }
        };

        bc.postMessage({key: 'payment-status', value: payment_status });

        // Wait X secs then close
        setTimeout(function(){
            bc.close(); window.close();
        }, 2000);
    }

    render(){        
        return(
            <div className='portal-page'>
                <div className={`status-icon ${this.props.match.params.status}`}>
                    {this.props.match.params.status === 'success' &&
                        <>
                            <i class="fas fa-check-circle"></i>
                            <span>Payment Successful</span>
                        </>
                    }

                    {this.props.match.params.status === 'failure' &&
                        <>
                            <i class="fas fa-minus-circle"></i>
                            <span>Payment Failure</span>
                        </>
                    }

                    {this.props.match.params.status === 'cancel' &&
                        <>
                            <i class="fas fa-times-circle"></i>
                            <span>Payment Canceled</span>
                        </>
                    }
                </div>
                <p className='directions'>Page now closing</p>
            </div>
        );
    }
}

export { PaymentPortal, PaymentStatusPortal };