import React, { Component } from 'react';
//mport { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

//import { Redirect } from 'react-router-dom';

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

	render() {

    	let {email,password} = this.state;
		this.props.logout({email : email, password : password});
		return (
			<div> WA </div>
		);
	}
}

function mapStateToProps(state, ownProps) {
    return {
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Logout)