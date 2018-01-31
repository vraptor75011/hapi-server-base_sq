import React from 'react';
//import App  from './App';
import App from './Layout/AppBar.js';
import DashBoardComponent from '../components/DashBoard';
import UsersComponent from './Users/Users';
import Broadcrumbs from '../components/Breadcrumbs'


const styles = {

    rootContainer: {
        padding: '25px 33px 0',
        marginTop: '1em'
    }
};

export const DashBoard = () => (
    <div>
        <App/>
        <Broadcrumbs linkName={'Dashboard'}/>
        <div style={styles.rootContainer}>
            <DashBoardComponent/>
        </div>

    </div>
)

export const Users = () => (
    <div>
        <App/>
        <Broadcrumbs linkName={'Users'}/>
        <div style={styles.rootContainer}>
            <UsersComponent/>
        </div>
    </div>
)
