import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Icon, Image} from 'semantic-ui-react';

const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
        {authUser => (
                <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 50}}>
                    <Grid.Column style = {{maxWidth: 420}}>
                    <Card>
                        <Image src={authUser.photoURL} wrapped ui={false} />
                        <Card.Content>
                        <Card.Header>{authUser.displayName}</Card.Header>
                        <Card.Meta>
                            <p>{authUser.email}</p>
                        </Card.Meta>
                        <Card.Description>
                            <p>Joined on {authUser.metadata.creationTime}}</p>
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='user' />
                                0 Friends
                        </Card.Content>
                    </Card>
                    </Grid.Column>
                </Grid>
        )}
        </AuthUserContext.Consumer>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);