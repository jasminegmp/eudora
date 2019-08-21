import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Image, Header} from 'semantic-ui-react';
import GiftReceivingTimesForm from '../GiftReceivingTimes';
import PasswordChangeForm from '../PasswordChange';
import UpdateAvatar from '../UpdateAvatar';
import 'firebase/storage';
import GetNumberOfFollowing from '../GetNumberOfFollowing';

const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
        {authUser => (
                <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 70, marginBottom: 70}}>
                    <Grid.Column style = {{maxWidth: 420}}>
                    <Header as = "h2" color = "grey" textAlign = "center">
                        Account Settings
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
                                <GetNumberOfFollowing />
                        </Card.Content>
                    </Card>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        'Tis the Season for Me to Receive Gifts
                        <GiftReceivingTimesForm/>
                    </Header>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        Change Password
                    </Header>
                    <PasswordChangeForm/>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        Change Avatar
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