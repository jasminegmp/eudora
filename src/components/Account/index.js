import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Header, Segment} from 'semantic-ui-react';

const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
        {authUser => (
                <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 50}}>
                    <Grid.Column style = {{maxWidth: 420}}>
                        <Segment>
                            <Header as = "h4" icon color = "grey" textAlign = "center">
                                Email: {authUser.email}
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid>
        )}
        </AuthUserContext.Consumer>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);