import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
//import {api} from '../../actions/_request';
import * as actions from '../../actions/auth.js';

import 
{
	AppAside,
	AppBreadcrumb,
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarFooter,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import * as navigation from '../../_nav';
// routes config
import * as routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component
{  
	
	render() 
	{
		let {user} = this.props.auth;
		let menuDeUsuario = [];
		let routes_user = [];

		switch(parseInt(user.tipo,10))
		{
			case 1: 
				menuDeUsuario = navigation.administrador; 
				routes_user = routes.routes;
				break;
			// case 2: menuDeUsuario = navigation.supervisor; break;
			case 3: 
				menuDeUsuario = navigation.gerente; 
				routes_user = routes.routes_gerente;
				break;
			case 4: 
				menuDeUsuario = navigation.almacenGeneral; 
				routes_user = routes.routes_almacenes_general;
				break;
			case 5: 
				menuDeUsuario = navigation.almacenLicor; 
				routes_user = routes.routes_almacenes_licor;
				break;
			case 6: 
				menuDeUsuario = navigation.barra; 
				routes_user = routes.routes_barra;

				break;
			default:
		}

		return (
			<div className="app">
				<AppHeader fixed>
					<DefaultHeader usuario={this.props.auth.user.name ? this.props.auth.user.name : ""}/>
				</AppHeader>
				<div className="app-body">
					<AppSidebar fixed display="lg">
						<AppSidebarHeader />
						<AppSidebarForm />
						<AppSidebarNav navConfig={menuDeUsuario} {...this.props} />
						<AppSidebarFooter />  
						<AppSidebarMinimizer />
					</AppSidebar>
					<main className="main">
						<AppBreadcrumb appRoutes={routes_user}/>
						<Container fluid>
							<Switch>
								{
									routes_user.map((route, idx) => 
									{
										return route.component ? 
											(<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (<route.component {...props} />)} />)
										: (null);
											})
								}
								<Redirect from="/" to="app/dashboard" />
							</Switch>
						</Container>
					</main>
					<AppAside fixed hidden>
						<DefaultAside />
					</AppAside>
				</div>
				<AppFooter>
					<DefaultFooter />
				</AppFooter>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps)
{
	return { auth:state.auth }
}
export default connect(mapStateToProps, actions)(DefaultLayout);