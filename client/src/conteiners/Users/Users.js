import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import UsersTable from '../../components/Users/UsersTable';
import {withStyles} from 'material-ui/styles';
import {getUsers, deleteUser, editUser, newUser} from '../../actions/users';
import {cancelForm} from '../../actions/form';
import { openModal, closeModal } from '../../actions/modals';
import { translate } from 'react-i18next';




const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }
});


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


        return (<div>
                <UsersTable {...this.props}/>
            </div>
        );
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getUsers, deleteUser, openModal, closeModal, editUser, newUser, cancelForm  }, dispatch);

}


function mapStateToProps(state) {

    return {users: state.reducers.users, user: state.reducers.user, modal: state.reducers.modal, form: state.reducers.form };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(translate()(Users)));
