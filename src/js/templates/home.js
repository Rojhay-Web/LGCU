import React, { Component } from 'react';

class Home extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    render(){        
        return(
            <div>HOME</div>
        );
    }
}

export default Home;