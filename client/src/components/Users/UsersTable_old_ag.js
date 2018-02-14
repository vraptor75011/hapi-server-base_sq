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
import {AgGridReact, AgGridColumn, SortableHeaderComponent} from 'ag-grid-react';

import CellButtons from './CellButtons';

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
            columnDefs: [
                {
                    field: 'firstName',
                    checkboxSelection: true,
                    filterParams: {
                    newRowsAction:'keep',
                    debounceMs: 0},
                    floatingFilterComponentParams: {
                        maxValue: 7,
                        suppressFilterButton: true
                    },
                },
                {
                    field: 'lastName',
                    newRowsAction:'keep',
                    floatingFilterComponentParams: {
                        maxValue: 7,
                        suppressFilterButton: true
                    },
                    filterParams: {
                        newRowsAction:'keep',
                        suppressFilterButton: true,
                        debounceMs: 0}
                },
                {
                    field: 'email',
                    newRowsAction:'keep',
                    filterParams: {
                        newRowsAction:'keep',
                        suppressFilterButton: true,
                        debounceMs: 0},
                    floatingFilterComponentParams: {
                        maxValue: 7,
                        suppressFilterButton: true
                    },
                },
                {   headerName: "",
                    field: "new",
                    cellRenderer: "CellButtons",
                    cellStyle: {textAlign: 'center'},
                    suppressFilter: true,
                    width: 45
                }
            ],
            frameworkComponents: {
                CellButtons: CellButtons
            },
            context: { componentParent: this },
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
            allowedPageSizes: [5, 10, 15]
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




    renderRowHeader = (data, index) => {

        return (<TableCell key={index + '-headerRow'}>{data.eng}</TableCell>)
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };


    onGridReady = (params) => {

        console.log('sss',params)
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();




       /* const dataSource = {
                rowCount: null,
                getRows: (params) => {
                    console.log("********asking for " + params.startRow + " to " + params.endRow);
                    params.successCallback(this.props.users.data|| [], 10);
                }
            };

        console.log(params)
        params.api.setDatasource(dataSource);*/




    }

    onFilterChanged = (value)  =>{

        console.log(value)
        //this.gridApi.getFilterModel();
        //console.log(this.gridApi.getModel())
        const filters = this.gridApi.getFilterModel();
        const keys = Object.getOwnPropertyNames(filters);
        console.log(filters)
        const listArray = keys.map((key)=> { return {[key]: '{like}'+filters[key].filter }})
        const params = Object.assign({}, ...listArray);//merge all object
        this.props.getUsers(params)
        console.log(params)



    };




    render() {
        const { classes, users, modal } = this.props;
        const { columnDefs, columns, allowedPageSizes,} = this.state;




        return (<div>{modal  && <UserForm {...this.state} {...this.props} cancel={ this.cancel} />}


            <Paper className={classes.root}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <div style={{
                                    boxSizing: "border-box",
                                    height: "100%",
                                    width: "100%"
                                }}
                                className="ag-theme-material"
                            ><div style={{ borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end'}}>
                                <AddButton onExecute={() => {
                                this.handleClickButtons('new')
                            }}/>
                            </div>
                    <AgGridReact
                        // properties
                        domLayout='autoHeight'
                        columnDefs={columnDefs}
                        frameworkComponents={this.state.frameworkComponents}
                        context={this.state.context}
                        floatingFilter={true}
                        suppressRowClickSelection={true}
                        enableColResize={true}
                        paginationPageSize={1}
                        rowModelType='infinite'
                        datasource = {this.props.users.data|| []}
                        rowBuffer= {0}
                        cacheOverflowSize= {2}
                        maxConcurrentDatasourceRequests= {2}
                        infiniteInitialRowCount= {1}
                        maxBlocksInCache= {2}
                        deltaRowDataMode={true}
                        pagination={true}
                        getRowNodeId={ (data) => {
                                    return data.id;
                                }
                        }

                        onPaginationChanged={(data)=>{
                            if (this.gridApi) {
                                const page = this.gridApi.paginationGetCurrentPage() + 1;

                                //this.props.getUsers({$page: page});
                           console.log("#lbLastPageFound", this.gridApi.paginationIsLastPageFound());
                                console.log("#lbPageSize", this.gridApi.paginationGetPageSize());
                                console.log("#lbCurrentPage", this.gridApi.paginationGetCurrentPage() + 1);
                                console.log("#lbTotalPages", this.gridApi.paginationGetTotalPages());
                                console.log(this.gridApi.paginationIsLastPageFound());
                                console.log("#LAST", this.gridApi);
                        }
                        }}
                        debug={true}
                        // events
                        onFilterChanged={this.onFilterChanged}
                        onGridReady={this.onGridReady}>
                    </AgGridReact>
                            </div>
                </div>
            </Paper>
            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles) (Users);