import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Autocomplete from '../../components/Users/Autocomplete';

import UsersTable from '../../components/Users/UsersTable';

import IconButton from 'material-ui/IconButton';

import {Button} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';



import {getUsers, deleteUser, editUser, newUser, singleUser} from '../../actions/users';
import { openModal, closeModal } from '../../actions/modals';



const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
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
            search: ''
        }



    }


    cancelEdit = () => {
        this.props.closeModal();

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });

        if (event.target.value.length> 2){
            const search = '{like}'+event.target.value;
            const data = {'$fullTextSearch':search };
            this.props.getUsers(data);
        }

    };

    render() {


        const { modal } = this.props;

        return (<div>
                <Autocomplete {...this.props} />
                <UsersTable {...this.props}/>
            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getUsers, deleteUser, openModal, closeModal, editUser, newUser  }, dispatch);

}


function mapStateToProps(state) {

    return {users: state.reducers.users, user: state.reducers.user, modal: state.reducers.modal };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Users));