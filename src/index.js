import './polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Route, Switch, HashRouter } from 'react-router-dom';

import reducers from './reducers';

import './index.css';

import SignIn from './views/Login';
import Page404 from './views/Pages/Page404';
import App from './App';

let store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
			<Switch>
				<Route exact path="/" component={SignIn} />
				<Route path="/app" component={App} />
				<Route component={Page404} />
			</Switch>
		</HashRouter>
	</Provider>,
    document.getElementById('root')
);