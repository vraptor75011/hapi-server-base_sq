import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import {Home, Users} from './conteiners/ComposedPages';
import RequiredAuth from './conteiners/auth/Required_auth';
import reducers from './reducers';
import './index.css';
import createHistory from 'history/createBrowserHistory';
import {ConnectedRouter, routerMiddleware, routerReducer} from 'react-router-redux';

import {Route} from 'react-router-dom';
import reduxThunk from 'redux-thunk';
//import Login from './components/LoginForm';
import SignIn from './conteiners/auth/SignIn';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        reducers,
        router: routerReducer
    }),
    applyMiddleware(middleware),
    applyMiddleware(reduxThunk)
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
                <Route exact path="/login" component={SignIn}/>
                <Route exact path="/" component={RequiredAuth(Home)}/>
                <Route exact path="/users" component={RequiredAuth(Users)}/>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
