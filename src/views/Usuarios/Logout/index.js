import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/auth.js';

class Logout extends Component {

	constructor(props){
    	super(props)

	    this.state={
    		email : '',
        	password : '',
    	}
    }

	render() 
    {
    	let {email,password} = this.state;
		this.props.logout({email : email, password : password});
		return ( <div> </div> );
	}
}

function mapStateToProps(state, ownProps) {
    return {
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Logout)