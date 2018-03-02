import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
import form from "../../reducers/roles/role_reducer";


class RoleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: {},
            newUser: false
        }
    }

    componentWillMount() {
        const currentData = this.props.row;
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

                switch (this.props.row.type) {

                    case 'edit':
                        this.props.editRealm(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.newRealm(data);
                        break;
                    case 'delete':
                        this.props.deleteRealm(data.id);
                        break;


                }


    };


    render() {
        const {modal, cancel, row, form, t} = this.props;
        const {currentData} = this.state;



        return (<Dialog
            open={modal}
            onClose={cancel}
        >
            <DialogTitle>{row.type === 'delete'? t('app:role.deleteRole') : row.type === 'edit' ? t('app:role.editRole'): t('app:role.newRole') }</DialogTitle>
            <DialogContent>
                {row.type !== 'delete' && <form noValidate autoComplete="off">
                    <TextField
                        id="name"
                        label={t('app:role.name')}
                        value={currentData.name}
                        onChange={(event) => this.handleChangeForm(event, 'name')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.name)}
                        helperText={form.error && form.error.name}
                    />
                    <TextField
                        id="description"
                        label={t('app:role.description')}
                        value={currentData.description}
                        onChange={(event) => this.handleChangeForm(event, 'description')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.description)}
                        helperText={form.error && form.error.description}

                    />

                </form>}
                {row.type === 'delete' && <div>{ t('app:role.deleteRoleWarning')}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">{t('crud.cancel')}</Button>
                {row.type !== 'delete' && <Button onClick={this.saveUser} color="primary">{t('crud.save')}</Button>}
                {row.type === 'delete' && <Button onClick={this.saveUser} color="primary">{t('crud.delete')}</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default RoleForm;
