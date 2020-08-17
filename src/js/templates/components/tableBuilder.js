import React, { Component } from 'react';

/* Body */
class TableBuilder extends Component{
    constructor(props) {
        super(props);
        this.state = {
            body:[]
        }

        this.buildTable = this.buildTable.bind(this);
    }

    componentDidMount(){ }

    buildTable(data){
        var rows = [];
        
        try {
            // Each Row
            for(var i =0; i < data.length; i++){
                var isFull = true;
                for(var j=0; j < data[i].body.length; j++){
                    data[i].body[j].colspan = 1;
                    for(var k =(j+1); k < data[i].body.length; k++) {
                        if(data[i].body[k].value.length > 0){ 
                            isFull = false;
                           break;
                        }
                    }
                    data[i].body[j].colspan = (!isFull ? 1 : (data[i].body[j].value.length > 0 ? data[i].body.length : 0));                        
                }
                rows.push({ isFull: isFull, cells: data[i].body.filter(function(cell){ return cell.colspan > 0;})})
            }
        }
        catch(ex){
            console.log("Error Building Table: ",ex);
        }

        return rows;
    }
    render(){        
        return(
            <div>
                {((this.props.table && this.props.table.table) && 
                    <table className={this.props.tableclass}>
                        {(this.props.table.table.thead) &&
                            <thead>
                                <tr className="header">
                                    {this.props.table.table.thead.map((head,i) =>
                                        <th key={i}>{head.value}</th>
                                    )}
                                </tr>
                            </thead>
                        }
                        {(this.props.table.table.tbody) &&
                            <tbody>
                                {this.buildTable(this.props.table.table.tbody).map((row,i) =>
                                    <tr className={(row.isFull ? "full-row" : "")} key={i}>
                                        {row.cells.map((cell,j) =>
                                            <td colSpan={cell.colspan} key={j}>{cell.value}</td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        }
                    </table>
                )}
            </div>
        );
    }
}

export default TableBuilder;