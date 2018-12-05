import React, { Component } from 'react';
import { HashRouter, Route, Switch , Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';

import '@coreui/icons/css/coreui-icons.min.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import './scss/style.css'

import { DefaultLayout } from './containers';

import * as actions from './actions/auth';

class App extends Component 
{
	componentDidMount() 
	{
        let { authenticated } = this.props.auth;
        if(authenticated) this.props.whoiam();
    }
	render()
	{
		let {authenticated} = this.props.auth;
		let {user} = this.props.auth;

		if(!authenticated) 
		{
			return ( <Redirect to={{pathname: '/'}} /> ) 
		}
		else 
		{
			if(user)
			{
				return( 
					<HashRouter>
						<Switch>
							<Route path="/" name="Home" component={DefaultLayout} />
						</Switch>
					</HashRouter>
				)
			}
			else
			{
				return(<div> </div>)
			}
		}
	}
}

function mapStateToProps(state, ownProps) {
    return {
        auth : state.auth
    }
}

export default connect(mapStateToProps, actions)(App);