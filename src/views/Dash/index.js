import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';

class Dash extends Component {

	render()
	{
		return (
			<div> Ventana De Inicio </div>
		);
	}
}

function mapStateToProps(state, ownProps) {
    return {
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Dash)