import React from 'react';
import PropTypes from 'prop-types';

import Table, {TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow,} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import {Button} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';
import UserForm from './UserForm';




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
                {eng: 'First name', italian: 'Nome'},
                {eng: 'Last name', italian: 'Cognome'},
                {eng: 'Email', italian: 'Email'},
                {eng: 'Last login', italian: 'Ultimo Login'}
            ],
            rows: [],
            row:{},
            sorting: [],
            editingRows: [],
            addedRows: [],
            changedRows: {},
            currentPage: 0,
            deletingRows: [],
            currentUserData: {id: "", "firstName": '', "lastName": '', "email": '', 'password': ''},
            pageSize: 0,
            allowedPageSizes: [5, 10, 15],
            openDeleteDialog: false
        };


    }


    componentDidMount() {

        this.props.getUsers();


    }



    handleClickButtons = (type, data) => {


        if (type === 'delete') {
            const row = Object.assign({}, data, {type: 'delete'});
            this.setState({row});
            this.props.openModal();
        }
        if (type === 'edit') {
            const row = Object.assign({}, data, {type: 'edit'});
            this.setState({row});
            this.props.openModal();
        }
        if (type === 'new') {
            const row = {id: "", "firstName": '', "lastName": '', "email": '', 'password': '', type: 'new'};
            this.setState({row});
            this.props.openModal();
        }
    };



    cancelEdit = () => {
        this.props.closeModal();
        this.setState({
            currentUserData: {id: "", "firstName": '', "lastName": '', "email": '', 'password': ''}
        });

    };


    renderRowTable = (data) => {

        const id = data.id;
        return (<TableRow
            tabIndex={-1}
            key={id+'-key-user'}
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
            <TableCell/>

        </TableRow>)
    };

    renderRowHeader = (data, index) => {

        return (<TableCell key={index + '-headerRow'}>{data.eng}</TableCell>)
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };




    render() {
        const { classes, users, modal } = this.props;
        const { columns, allowedPageSizes,} = this.state;


console.log(users)

        return (<div>{modal  && <UserForm {...this.state} {...this.props} cancelEdit={ this.cancelEdit} />}
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
                                {!users.docs && <TableRow/>}
                                {users.docs && users.docs.map(this.renderRowTable)}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        count={users.pages && users.pages.total}
                                        rowsPerPage={10}
                                        rowsPerPageOptions={allowedPageSizes}
                                        page={users.pages && users.pages.current}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />


                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>
            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Users);