import React, { Component } from 'react';
import { useBroadcastChannel } from "use-broadcast-channel";

/* Header */
class PaymentPortalHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div></div>
        );
    }
}

/* Body */
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
        return(<div></div>);
    }
}

export {PaymentPortal, PaymentPortalHeader};