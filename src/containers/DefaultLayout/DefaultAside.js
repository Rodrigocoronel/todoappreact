import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

	constructor(props)
	{
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = { activeTab: '1'};
	}

	toggle(tab) 
	{
		if (this.state.activeTab !== tab)
		{
			this.setState({ activeTab: tab });
		}
	}

	render() 
	{
		return (<div></div>);
	}
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;