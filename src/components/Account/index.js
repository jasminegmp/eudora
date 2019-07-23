import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Icon, Image, Header, Segment} from 'semantic-ui-react';
import PasswordChangeForm from '../PasswordChange';
import UpdateAvatar from '../UpdateAvatar';
import 'firebase/storage';

const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
        {authUser => (
                <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 50}}>
                    <Grid.Column style = {{maxWidth: 420}}>
                    <Header as = "h2" color = "grey" textAlign = "center">
                        Account Info
                    </Header>
                    <Card centered>
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
                        <Card.Content extra>
                        </Card.Content>
                    </Card>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        Change Your Password
                    </Header>
                    <PasswordChangeForm/>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        Change Your Avatar
                    </Header>
                    <UpdateAvatar/>

                    </Grid.Column>
                </Grid>
        )}
        </AuthUserContext.Consumer>
    )
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);