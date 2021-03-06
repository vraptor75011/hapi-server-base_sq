import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { Button } from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import UserForm from './UserForm';
import ReactTable from 'react-table';
import SearchIcon from 'material-ui-icons/Search';
import ArrowRight from 'material-ui-icons/KeyboardArrowRight';
import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import Input, { InputAdornment } from 'material-ui/Input';
import debounce from 'lodash/debounce';
import moment from 'moment'





class Users extends React.PureComponent {
  constructor(props) {
    super(props);
      const AddButton = ({ onExecute }) => (
          <Button color="primary" onClick={onExecute} title= {props.t('crud.new')}>
              {props.t('crud.new')}
          </Button>
      );
      AddButton.propTypes = {
          onExecute: PropTypes.func.isRequired,
      };

      const EditButton = ({ onExecute }) => (
          <IconButton onClick={onExecute} title= {props.t('crud.edit')}>
              <EditIcon />
          </IconButton>
      );
      EditButton.propTypes = {
          onExecute: PropTypes.func.isRequired,
      };

      const DeleteButton = ({ onExecute }) => (
          <IconButton onClick={onExecute} title={props.t('crud.delete')}>
              <DeleteIcon />
          </IconButton>
      );
      DeleteButton.propTypes = {
          onExecute: PropTypes.func.isRequired,
      };
    this.state = {
      users: [],
      pages: {
        current: 1,
        hasNext: false,
        hasPrev: false,
        next: 2,
        prev: 0,
        total: 1,
      },
      columns: [
        {
          Header: props.t('app:user.firstName'),
          accessor: 'firstName',
          minWidth: 200,
          Filter: ({ filter, onChange }) => (
            <div style={{ width: '100%' }}>
              <Input
                id="email"
                value={filter ? filter.value : ''}
                style={{ width: '100%' }}
                onChange={event => onChange(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </div>
          ),
        },
        {
          Header: props.t('app:user.lastName'),
          accessor: 'lastName',
          minWidth: 200,
          Filter: ({ filter, onChange }) => (
            <div style={{ width: '100%' }}>
              <Input
                id="email"
                value={filter ? filter.value : ''}
                style={{ width: '100%' }}
                onChange={event => onChange(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </div>
          ),
        },
        {
          Header: 'Email',
          accessor: 'email',
          minWidth: 200,
          Filter: ({ filter, onChange }) => (
            <div style={{ width: '100%' }}>
              <Input
                id="email"
                value={filter ? filter.value : ''}
                style={{ width: '100%' }}
                onChange={event => onChange(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </div>
          ),
        },
        {
          Header: props.t('app:user.isActive'),
          id: 'isActive',
          maxWidth: 120,
          filterable: false,
          accessor: user => {
            return <div>{user.isActive ? 'Si' : 'No'}</div>;
          }
        },
          {
              Header: props.t('app:user.lastLoginAt'),
              id:'currentLoginAt',
              filterable: false,
              accessor: user => {
                  return (<div>{user.lastLoginAt &&  moment(user.lastLoginAt).format('DD-MM-YYYY')+'/' }{user.lastLoginIP}</div>);
              }

          },
        {
          Header: () => (
            <AddButton
              onExecute={() => {
                this.handleClickButtons('new');
              }}
            />
          ),
          accessor: 'edit',
          maxWidth: 120,
          Cell: ({ original }) => {
            return (
              <div>
                <DeleteButton
                  onExecute={() => {
                    this.handleClickButtons('delete', original);
                  }}
                />
                <EditButton
                  onExecute={() => {
                    this.handleClickButtons('edit', original);
                  }}
                />
              </div>
            );
          },
          filterable: false,
        },
      ],
      loading: true,
      rows: [],
      row: {},
      sorting: [],
      editingRows: [],
      addedRows: [],
      changedRows: {},
      currentPage: 0,
      deletingRows: [],
      currentUserData: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      pageSize: 0,
      allowedPageSizes: [5, 10, 15],
      openDeleteDialog: false,
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }
  fetchData = debounce(state => {
    const filtered = state.filtered;
    const filteredData = filtered.map(field => {
      return { [field.id]: '{like}' + field.value };
    });
    const params = Object.assign({}, ...filteredData); //merge all object

    let page = state.page;

    if (page > 0) {
      page++;
      Object.assign(params, { ['$page']: page });
    }

    this.props.getUsers(params);
  }, 300);

  handleClickButtons = (type, data) => {
    if (type === 'delete') {
      const row = Object.assign({}, data, { type: 'delete' });
      this.setState({ row });
      this.props.openModal();
    }
    if (type === 'edit') {
      const row = Object.assign({}, data, { type: 'edit' });
      this.setState({ row });
      this.props.openModal();
    }
    if (type === 'new') {
      const row = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        type: 'new',
      };
      this.setState({ row });
      this.props.openModal();
    }
  };

  cancel = () => {
    this.props.closeModal();
    this.props.cancelForm();
    this.setState({
      currentUserData: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
    });
  };

  render() {
    const { classes, users, modal, t } = this.props;
    const { columns } = this.state;

    return (
      <div>
        {modal && (
          <UserForm {...this.state} {...this.props} cancel={this.cancel} />
        )}
        <Paper className={classes.root}>
          <ReactTable
            columns={columns}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={users.docs ? users.docs : []}
            pages={users.pages ? users.pages.total : 1} // Display the total number of pages
            loading={false} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
            filterable={true}
            resizable={false}
            sortable={false}
            collapseOnSortingChange={true}
            collapseOnPageChange={true}
            collapseOnDataChange={true}
            defaultPageSize={users.items ? users.items.total : 3}
            showPageSizeOptions={false}
            previousText={t('table.previousText')}
            nextText={t('table.nextText')}
            loadingText={t('table.loadingText')}
            noDataText={t('table.noDataText')}
            pageText={t('table.pageText')}
            ofText={t('table.ofText')}
            rowsText={t('table.rowsText')}
            showPaginationBottom
            PreviousComponent={props => (
              <IconButton onClick={props.onClick}>
                <ArrowLeft />
              </IconButton>
            )}
            NextComponent={props => (
              <IconButton onClick={props.onClick}>
                <ArrowRight />
              </IconButton>
            )}
          />
        </Paper>
      </div>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (Users);
