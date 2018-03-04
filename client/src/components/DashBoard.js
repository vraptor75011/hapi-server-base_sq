import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import PersonIcon from 'material-ui-icons/Person';
import GroupIcon from 'material-ui-icons/Group';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

const styles = {
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },

    card: {
        display: 'flex',
    },
    icon: {
        width: '5em',
        height: '5em',
        color: '#9c27b0',
    },
    typography: {
        textAlign: 'center',
    },
    singleIconContainer: {
        display: 'block',
        width: '9em',
        textAlign: 'center',
        padding: '1em',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f1efef',
        },
    },
};

class Home extends Component {
    constructor(props) {
        super(props);
    }

    handlerClick = type => {
        switch (type) {
            case 'users':
                this.props.dispatch(push('/users'));
                break;
            case 'roles':
                this.props.dispatch(push('/roles'));
                break;
            case 'geoRepartitions':
                this.props.dispatch(push('/geoRepartitions'));
                break;
            case 'realms':
                this.props.dispatch(push('/realms'));
                break;
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                <div
                    className={classes.singleIconContainer}
                    onClick={() => this.handlerClick('users')}
                >
                    <PersonIcon className={classes.icon} />

                    <Typography
                        style={{ fontSize: '1rem' }}
                        className={classes.typography}
                        type="title"
                    >
                        Users
                    </Typography>
                    <Typography
                        style={{ fontSize: '0.8rem', opacity: '.87' }}
                        className={classes.typography}
                        type="subheading"
                    >
                        Add, rename and manage users
                    </Typography>
                </div>
                <div
                    className={classes.singleIconContainer}
                    onClick={() => this.handlerClick('roles')}
                >
                    <GroupIcon className={classes.icon} />

                    <Typography
                        style={{ fontSize: '1rem' }}
                        className={classes.typography}
                        type="title"
                    >
                        Roles
                    </Typography>
                    <Typography
                        style={{ fontSize: '0.8rem', opacity: '.87' }}
                        className={classes.typography}
                        type="subheading"
                    >
                        Add, rename and manage roles
                    </Typography>
                </div>
                <div
                    className={classes.singleIconContainer}
                    onClick={() => this.handlerClick('realms')}
                >
                    <GroupIcon className={classes.icon} />

                    <Typography
                        style={{ fontSize: '1rem' }}
                        className={classes.typography}
                        type="title"
                    >
                        Realms
                    </Typography>
                    <Typography
                        style={{ fontSize: '0.8rem', opacity: '.87' }}
                        className={classes.typography}
                        type="subheading"
                    >
                        Add, rename and manage realms
                    </Typography>
                </div>
                <div
                    className={classes.singleIconContainer}
                    onClick={() => this.handlerClick('geoRepartitions')}
                >
                    <GroupIcon className={classes.icon} />

                    <Typography
                        style={{ fontSize: '1rem' }}
                        className={classes.typography}
                        type="title"
                    >
                        GeoRepartitions
                    </Typography>
                    <Typography
                        style={{ fontSize: '0.8rem', opacity: '.87' }}
                        className={classes.typography}
                        type="subheading"
                    >
                        Add, rename and manage geoRepartitions
                    </Typography>
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return { authenticated: state.reducers.auth.authenticated };
}

export default connect(mapStateToProps)(withStyles(styles)(Home));
