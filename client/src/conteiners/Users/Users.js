import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Autocomplete from '../../components/Users/Autocomplete';
import UsersTable from '../../components/Users/UsersTable';
import {withStyles} from 'material-ui/styles';
import {getUsers, deleteUser, editUser, newUser} from '../../actions/users';
import { openModal, closeModal } from '../../actions/modals';



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