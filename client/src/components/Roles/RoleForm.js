import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
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


class RoleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: {},
            newUser: false
        }
    }

    componentWillMount() {
        const currentData = this.props.modalData.role;

        this.setState({currentData});
    }


    handleChangeForm = (event, type) => {

        let currentData = {...this.state.currentData, [type]: event.target.value};
        this.setState({currentData});


    };

    saveUser = () => {

        const {currentData} = this.state;
        const data = {
            id: currentData.id,
            name: currentData.name,
            description: currentData.description,

        };

                switch (this.props.modalData.type) {

                    case 'edit':
                        this.props.edit(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.new(data);
                        break;
                    case 'delete':

                        this.props.delete(data.id);
                        break;


                }




    };


    render() {
        const {classes, modal, cancelEdit, modalData} = this.props;
        const {currentData} = this.state;


        return (<Dialog
            open={modal}
            onClose={this.cancelEdit}
            classes={{paper: classes.dialog}}
        >
            <DialogTitle>{modalData.type === 'delete'? 'Delete Role' : modalData.type === 'edit' ? 'Edit Role': 'New Role' }</DialogTitle>
            <DialogContent>
                {modalData.type !== 'delete' && <form noValidate autoComplete="off">
                    <TextField
                        id="name"
                        label="Name"
                        className={classes.textField}
                        value={currentData.name}
                        onChange={(event) => this.handleChangeForm(event, 'name')}
                        margin="normal"
                        fullWidth={true}
                    />
                    <TextField
                        id="description"
                        label="Description"
                        className={classes.textField}
                        value={currentData.description}
                        onChange={(event) => this.handleChangeForm(event, 'description')}
                        margin="normal"
                        fullWidth={true}
                    />

                </form>}
                {modalData.type === 'delete' && <div>Are you sure to delete this role?</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelEdit} color="primary">Cancel</Button>
                {modalData.type !== 'delete' && <Button onClick={this.saveUser} color="primary">Save</Button>}
                {modalData.type === 'delete' && <Button onClick={this.saveUser} color="primary">Delete</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default withStyles(styles)(RoleForm);