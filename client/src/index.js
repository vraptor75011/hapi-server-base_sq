import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import {DashBoard, Users, Roles} from './conteiners/ComposedPages';
import Page404 from './components/Page404';
import RequiredAuth from './conteiners/auth/Required_auth';
import reducers from './reducers';
import './index.css';
import './css/react-table.css';
import createHistory from 'history/createBrowserHistory';
import {ConnectedRouter, routerMiddleware, routerReducer} from 'react-router-redux';

import {Route, Switch} from 'react-router-dom';
import reduxThunk from 'redux-thunk';


import ReduxPromise from 'redux-promise'

import Login from './conteiners/auth/Login';


// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

const store = createStore(


    combineReducers({
        reducers,
        router: routerReducer
    }),
    applyMiddleware(middleware,ReduxPromise,reduxThunk)


);

const theme = createMuiTheme({
    palette: {
        primary: purple
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme}>
                <Switch>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/dashboard" component={RequiredAuth(DashBoard)}/>
                <Route exact path="/users" component={RequiredAuth(Users)}/>
                <Route exact path="/roles" component={RequiredAuth(Roles)}/>
                <Route component={Page404} />
                </Switch>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
