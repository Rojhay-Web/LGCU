import React, { Component } from 'react';

/* Header */
class UCHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div>UC Header</div>
        );
    }
}

/* Body */
class UC extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div>Under Construction</div>
        );
    }
}

export {UC, UCHeader};