import React from 'react';
import {withAuthorization } from '../Session';
import GiftReceivingTimesForm from '../GiftReceivingTimes';
import UpdateAvatar from '../UpdateAvatar';
import { withRouter} from 'react-router-dom';
import {Grid, Segment, Image, Card} from 'semantic-ui-react';
import MyWishlistPage from '../MyWishlist';

class HomePage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            photoUrl: '',
            uid: this.props.firebase.currentUser().uid,
            firstName: '',
            error: null
        };
    }
    componentDidMount(){
        // Grab first name
        this.props.firebase.getFirstName(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const firstName = snapshot.val();
            this.setState({ firstName})
          });

        // Grab photo url
        this.props.firebase.getPhotoUrl(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const photoUrl = snapshot.val();
            this.setState({ photoUrl})
          });

    }


    render(){
        return (
            <div style = {{margin: 70}}>
                <h1>Welcome Back to Eudora, {this.state.firstName}!</h1>
                <Grid columns={2} stackable textAlign = "center" verticalAlign = "top">
                    <Grid.Column>
                        <Segment>
                            <h3>Update your avatar</h3>
                                <Card centered>
                                    <Image src={this.state.photoUrl} />
                                </Card>
                                <UpdateAvatar/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <h3>{this.state.firstName}'s Wishlist</h3>
                            <Segment>
                                <MyWishlistPage smallerView={true}/>
                            </Segment>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column >
                        <Segment>
                            <h3>Complete your profile</h3>
                            <GiftReceivingTimesForm/>
                        </Segment>
                    </Grid.Column>
                </Grid>
               
            </div>
        );

    }
    
};

const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(HomePage));
