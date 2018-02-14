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

import ReactTable from 'react-table';

import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui-icons/Search';
import ArrowRight from 'material-ui-icons/KeyboardArrowRight';
import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';





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
            columns:[
                {
                    Header: "First Name",
                    accessor: "firstName",
                    Filter: ({filter, onChange}) => (
                        <div style={{width: '100%'}}>
                            <Input id="email"  value={this.state.username}
                                   style={{ width: '100%'}}
                                   onChange={this.handleChangeEmail}
                                   endAdornment={
                                       <InputAdornment position="end">
                                               <SearchIcon/>
                                       </InputAdornment>
                                   }
                            />
                        </div>
                    )
                },
        {
            Header: "Last Name",
                accessor: "lastName",

            Filter: ({filter, onChange}) =>  (
                <div style={{width: '100%'}}>
                    <Input id="email"  value={this.state.username}
                           style={{ width: '100%'}}
                           onChange={this.handleChangeEmail}
                           endAdornment={
                               <InputAdornment position="end">
                                   <SearchIcon/>
                               </InputAdornment>
                           }
                    />
                </div>
            )},
        {
            Header: "Email",
                accessor: "email",
            Filter: ({filter, onChange}) =>  (
                <div style={{width: '100%'}}>
                    <Input id="email"  value={this.state.username}
                           style={{ width: '100%'}}
                           onChange={this.handleChangeEmail}
                           endAdornment={
                               <InputAdornment position="end">
                                   <SearchIcon/>
                               </InputAdornment>
                           }
                    />
                </div>
            )
        },
        {   Header: ()=><AddButton/>,
            accessor: "edit",
            maxWidth:120,
            Cell: ({original}) => {

            return (<div><DeleteButton /><EditButton /></div>)

        },
            filterable: false


        }


    ],
            loading: true,
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



    cancel = () => {
        this.props.closeModal();
        this.props.cancelForm();
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
        const { columns, allowedPageSizes, loading} = this.state;




        return (<div>{modal  && <UserForm {...this.state} {...this.props} cancel={ this.cancel} />}
                   <Paper className={classes.root}>


                    <div className={classes.tableWrapper}>
                        <ReactTable
                            columns={columns}
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={users.docs ? users.docs  : []}
                            pages={users.pages ? users.pages.total  : 1} // Display the total number of pages
                            loading={false} // Display the loading overlay when we need it
                            onFetchData={this.fetchData} // Request new data when things change
                            filterable={true}
                            resizable={false}
                            sortable={false}
                            collapseOnSortingChange={true}
                            collapseOnPageChange={true}
                            collapseOnDataChange={true}
                            defaultPageSize={users.items ? users.items.total  : 1}
                            showPageSizeOptions= {false}
                            previousText= 'Precedente'
                            nextText=  'Successivo'
                            loadingText= 'Caricamento...'
                            noDataText=  'Nessun dato'
                            pageText=  'Pagina'
                            ofText=  'di'
                            rowsText=  'righe'
                            showPaginationBottom
                            PreviousComponent={()=><ArrowLeft/>}
                            NextComponent={()=><ArrowRight/>}

                        />
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