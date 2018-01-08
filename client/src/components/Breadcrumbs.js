import React, {Component} from 'react';

import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {withStyles} from "material-ui/styles/index";




class Broadcrumbs extends Component {
    constructor(props) {
        super(props);
    }

    handlerClick = () => {

       const link = this.props.linkName;

       this.props.dispatch(push("/"+ link.toLowerCase() ));
    };
render() {


        return (<div style={{
            width: '100%', height: '3em', marginTop: '4em', borderBottom:
                '1px solid #d2d0d0', display: 'flex', backgroundColor: '#fff'
        }}>
            <a onClick={this.handlerClick} style={{
                alignItems: 'center', display: 'flex', marginLeft: '26px', fontSize: '20px',
                color: 'rgba(0,0,0,0.54)', cursor: 'pointer'
            }}>
                {this.props.linkName}
            </a>
        </div>)
    }
};






export default connect()(Broadcrumbs);


