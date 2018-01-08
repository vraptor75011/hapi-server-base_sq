import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Card, {CardContent} from 'material-ui/Card';

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40em'
    },
    formControl: {
        margin: theme.spacing.unit
    },
    card: {
        width: '26em',
        height: '13em',
        alignSelf: 'center',
        margin: 'auto'
    }
});

class LoginForm extends React.Component {
    state = {
        username: 'Login',
        password: 'Password'
    };

    handleChange = event => {
        this.setState({name: event.target.value});
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardContent>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="username">Name</InputLabel>
                            <Input
                                id="username"
                                value={this.state.username}
                                onChange={this.handleChangeUsername}
                            />
                            <FormHelperText>Some important helper text</FormHelperText>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="password">Name</InputLabel>
                            <Input
                                id="password"
                                value={this.state.password}
                                onChange={this.handleChangePassword}
                            />
                            <FormHelperText>Some important helper text</FormHelperText>
                        </FormControl>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
