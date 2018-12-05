import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';

class Dash extends Component {

	render()
	{
		return (
			<div> <i className="icons font-2xl d-block mt-5 cui-chart"> </i> </div>
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