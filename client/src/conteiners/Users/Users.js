import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import UserForm from './UserForm';


import Table, {TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow,} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';


import { getUsers } from '../../actions/users';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
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
            users: [],
            pages: {current: 1, hasNext: false, hasPrev: false, next: 2, prev: 0, total: 1},
            columns: [
                {name: 'firstName', title: 'Nome'},
                {name: 'lastName', title: 'Cognome'},
                {name: 'email', title: 'Email'},
                {name: 'lastLogin', title: 'Lastest Login'}
            ],
            rows: [],
            sorting: [],
            editingRows: [],
            addedRows: [],
            changedRows: {},
            currentPage: 0,
            deletingRows: [],
            currentUserData: {_id: "", "firstName": '', "lastName": '', "email": '', 'password': ''},
            pageSize: 0,
            allowedPageSizes: [5, 10, 15],
            openDeleteDialog: false,
            openEditDialog: false
        };


    }


    componentDidMount() {

        this.props.getUsers();


    }

    /*getUsers = () => {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

        axios.get(`http://localhost:4000/api/v1/users`).then(response => {
            console.log('response', response);
            const users = response.data.docs;
            const pages = response.data.pages;
            console.log(pages)
            this.setState({users})
        }).catch((error) => {


            if (error.response && error.response.status === 401) {
                //if request is unauthorized redirect to login page
                this.props.dispatch(push("/login"));
            }
        });
    };*/

    deleteUser = () => {

        const {currentUserData} = this.state;

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

        axios.delete(`http://localhost:8000/user/${currentUserData._id}`, {
            "hardDelete": true
        }).then(response => {
            console.log('response', response);
            this.cancelDelete();
            this.getUsers();
        }).catch((error) => {


            if (error.response && error.response.status === 401) {
                //if request is unauthorized redirect to login page
                this.props.dispatch(push("/login"));
            }
        });
    };

    handleClickButtons = (type, data) => {

        if (type === 'delete') {
            this.setState({openDeleteDialog: true, currentUserData: data});
        }
        if (type === 'edit') {
            this.setState({openEditDialog: true, currentUserData: data});
        }
        if (type === 'new') {
            this.setState({
                openEditDialog: true,
                currentUserData: {_id: "", "firstName": '', "lastName": '', "email": '', 'password': ''}
            });
        }
    };

    cancelDelete = () => {

        this.setState({
            openDeleteDialog: false,
            currentUserData: {_id: "", "firstName": '', "lastName": '', "email": '', 'password': ''}
        });

    };

    cancelEdit = () => {

        this.setState({
            openEditDialog: false,
            currentUserData: {_id: "", "firstName": '', "lastName": '', "email": '', 'password': ''}
        });

    };


    renderRowTable = (data) => {

        const id = data._id;
        return (<TableRow
            tabIndex={-1}
            key={data._id}
        >
            <TableCell>
                <div style={{display: 'flex'}}>
                <EditButton onExecute={() => {
                    this.handleClickButtons('edit', data)
                }}/>
                <DeleteButton onExecute={() => {
                    this.handleClickButtons('delete', data)
                }}/>
                </div>
            </TableCell>
            <TableCell>{data.firstName}</TableCell>
            <TableCell>{data.lastName}</TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell></TableCell>

        </TableRow>)
    };

    renderRowHeader = (data, index) => {

        return (<TableCell key={index + '-headerRow'}>{data.name}</TableCell>)
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };


    handleChangeUserForm = (event, type) => {
        const currentUserData = this.state;

        if (type === 'firstName') {
            currentUserData.firstName = event.target.value;

            //this.setState({ currentUserData: { ...this.state.currentUserData } });
        }
        if (type === 'lastName') {
            currentUserData.lastName = event.target.value;
        }
        if (type === 'email') {
            currentUserData.email = event.target.value;
        }

        //this.setState({currentUserData});
    }

    render() {
        const { classes, users } = this.props;
        const {
            rows,
            pages,
            columns,
            sorting,
            editingRows,
            addedRows,
            changedRows,
            currentPage,
            deletingRows,
            pageSize,
            allowedPageSizes,
            columnOrder,
            openDeleteDialog,
            openEditDialog,
            currentUserData
        } = this.state;



console.log(this.props )

        return (<div>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>

                            <TableHead>
                                <TableRow>
                                    <TableCell><AddButton onExecute={() => {
                                        this.handleClickButtons('new')
                                    }}/></TableCell>
                                    {columns.map(this.renderRowHeader)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users && users.docs.map(this.renderRowTable)}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={users && users.pages.total || 1}
                                        rowsPerPage={10}
                                        rowsPerPageOptions={allowedPageSizes}
                                        page={users && users.pages.current}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />

                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>


                <Dialog
                    open={openDeleteDialog}
                    onClose={this.cancelDelete}
                    classes={{paper: classes.dialog}}
                >
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure to delete the following row?
                        </DialogContentText>
                        <Paper>

                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
                        <Button onClick={this.deleteUser} color="accent">Delete</Button>
                    </DialogActions>
                </Dialog>
                {openEditDialog && <UserForm {...this.state} cancelEdit={this.cancelEdit} getUsers={this.getUsers}/>}
            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch){

    return bindActionCreators({getUsers }, dispatch);

}


function mapStateToProps(state) {
    console.log(state)
    return {users: state.users, pippo: 'pippo' };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));