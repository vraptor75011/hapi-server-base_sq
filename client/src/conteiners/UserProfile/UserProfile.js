import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import UserForm from './UserForm';


import Table, {TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow,} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';


const styles = theme => ({
    root: {
        paddingRight: 2,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.A700,
                backgroundColor: theme.palette.secondary.A100,
            }
            : {
                color: theme.palette.secondary.A100,
                backgroundColor: theme.palette.secondary.A700,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    }
});

const AddButton = ({onExecute}) => (

    <Button
        color="primary"
        onClick={onExecute}
        title="Create new row"
    >
        New
    </Button>

);
AddButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};

const EditButton = ({onExecute}) => (
    <IconButton onClick={onExecute} title="Edit row">
        <EditIcon/>
    </IconButton>
);
EditButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};

const DeleteButton = ({onExecute}) => (
    <IconButton onClick={onExecute} title="Delete row">
        <DeleteIcon/>
    </IconButton>
);
DeleteButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};


class Users extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            user: [],
        };


    }


    componentDidMount() {

        this.getUsers();


    }

    getUser = () => {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

        axios.get(`http://localhost:8000/user/${id}`).then(response => {
            console.log('response', response);
            const user = response.data.docs;
            this.setState({user})
        }).catch((error) => {


            if (error.response && error.response.status === 401) {
                //if request is unauthorized redirect to login page
                this.props.dispatch(push("/login"));
            }
        });
    };


    render() {
        const {
            classes,
        } = this.props;
        const {

        } = this.state;

        return (<div>

            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {authenticated: state.reducers.auth.authenticated};
}

export default connect(mapStateToProps)(withStyles(styles)(Users));