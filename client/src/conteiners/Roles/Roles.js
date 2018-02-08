import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RolesTable from '../../components/Roles/RolesTable';

import {withStyles} from 'material-ui/styles';



import {getRoles, deleteRole, editRole, newRole} from '../../actions/roles';
import { openModal, closeModal } from '../../actions/modals';



const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }
});




class Roles extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }



    }



    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });

        if (event.target.value.length> 2){
            const data = {'$fullTextSearch':event.target.value };
            this.props.getUsers(data);
        }

    };

    render() {


        const { modal } = this.props;
        return (<div>

                <RolesTable{...this.props}/>
            </div>
        );
    }
}


Roles.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getRoles, deleteRole, openModal, closeModal, editRole, newRole  }, dispatch);

}


function mapStateToProps(state) {

    return {roles: state.reducers.roles, role: state.reducers.role, modal: state.reducers.modal};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Roles));