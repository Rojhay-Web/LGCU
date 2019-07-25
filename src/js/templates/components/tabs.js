import React, { Component } from 'react';
import $ from 'jquery';

/* Body */
class TABS extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedId: 0
        }

        this.changeSelected = this.changeSelected.bind(this);
    }

    componentDidMount(){ }

    changeSelected(id){
        var self = this;
        this.setState({selectedId: id}, () =>{            
            self.props.list.forEach(function(item,i){
                if(i !== id) { $(self.refs['tabcontent-' + i]).slideUp(); }
            });            
            $(self.refs['tabcontent-' + id]).slideDown();
        });        
    }

    render(){        
        return(
            <div className="tab">
                <ul className="tabs">
                    {this.props.list.map((item,i) =>(
                        <li key={i} className={"tabItem" + (this.state.selectedId === i ? " current": "")} id={"tab-"+i} onClick={()=> this.changeSelected(i)}>
                            <i className={"studyicon " + item.icon}></i>
                            <span>{item.title}</span>
                        </li>
                    ))}
                </ul>
                <div className="tab-content">
                    {this.props.list.map((item,i) =>(
                        <div className="content-item" key={i} ref={"tabcontent-"+i}>
                            <div className="content-container">
                                <div className="content-info">
                                    <p>{item.description}</p>
                                    <div className="lBtn-group">
                                    <a href="/" className="lBtn c2"><span>Learn More</span><i className="btn-icon fas fa-graduation-cap"></i></a>
                                    </div>
                                </div>
                                <div className="img-container"><img alt="Tab img" src={item.img} /></div>
                                <div className="mobile-title">{item.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TABS;