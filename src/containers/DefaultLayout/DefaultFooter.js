import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component 
{
	render() 
	{
		return (
			<React.Fragment>
				<span className="ml-auto"><i> WeNatives 2018. </i></span>
			</React.Fragment>
		);
	}
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
