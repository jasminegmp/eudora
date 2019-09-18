import React from 'react';
import {Card, Grid, Segment} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import PurchasedItem from '../PurchasedItem';
import UpdateAvatar from '../UpdateAvatar';
import Avatar from '../Avatar';
import ItemPhoto from '../ItemPhoto';
import AddItemtoWishlist from '../AddItemtoWishlist';

class FetchProfileInfo extends React.Component {
    
    constructor(props){
        super(props);
    
        this.state = {
            currentUser: '',
            firstName: '',
            lastName: '',
            photoUrl: null,
            uid: props.uid,
            holidays: [],
            items: [],
            loading: false,
            error: null
        }
    }

    
    componentDidMount() {

        const {uid} = this.state;
      
        this.setState({ loading: true });

        this.setState({currentUser: this.props.firebase.currentUser().uid});

        // Grab first name
        this.props.firebase.getFirstName(uid).on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }
          const firstName = snapshot.val();
          this.setState({ firstName})
        });

        // Grab last name
        this.props.firebase.getLastName(uid).on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }
          const lastName = snapshot.val();
          this.setState({ lastName})

        });

        // Grab photo url
        this.props.firebase.getPhotoUrl(uid).on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }
          const photoUrl = snapshot.val();
          this.setState({ photoUrl})
        });

        // Grab holidays
        this.props.firebase.getHolidays(uid).on('value', snapshot => {
          const holidaysObject = snapshot.val();
          if (this.isUnmounted) {
            return;
          }

          if (holidaysObject) {
              
            const holidaysList = Object.keys(holidaysObject).map(key => ({
              ...holidaysObject[key],
              uid: key,
            }));
      
            this.setState({ holidays: holidaysList, loading: false });
          } else {
            this.setState({holidays: null, loading: false });
          }
        });

        // Grab wishlist items
        this.props.firebase.items(uid).on('value', snapshot => {
          const itemsObject = snapshot.val();
          //console.log(itemsObject);
          if (this.isUnmounted) {
            return;
          }

          if (itemsObject) {
              
            const itemsList = Object.keys(itemsObject).map(key => ({
              ...itemsObject[key],
              uid: key,
            }));
      
            this.setState({ items: itemsList, loading: false });
          } else {
            this.setState({items: null, loading: false });
          }
        });

      }
        
    componentWillUnmount() {
        this.props.firebase.getFirstName().off();
        this.props.firebase.getLastName().off();
        this.props.firebase.items().off();
        this.isUnmounted = true;
      }


    render() {
        const { items, loading, firstName, lastName, holidays, photoUrl, uid, currentUser} = this.state;
        return(
            <div>

              <Grid stackable columns={2}>
                <Grid.Column width={4}>
                    <h1 style = {{textAlign: "center"}}>{firstName} {lastName}</h1>
                    <Card centered>
                    {this.props.firebase.currentUser().uid === uid ? <UpdateAvatar uid = {uid}/> : <Avatar className = "avatar" uid = {uid} photoUrl = {photoUrl}/>}
                    </Card>
                    {loading && <div>Loading ...</div>}
                    <Segment>
                      {holidays ? 
                          ( <div>                        
                              <h4>I celebrate...</h4>
                              {holidays.map(holiday => (
                                
                                <div  key ={holiday.holiday}>

                                  <p><em>{holiday.holiday}</em>
                                {" on " + holiday.date.substring(5,10)}
                                </p>
                                </div>
                              ))}
                            </div>

                          )
                      : 
                          (<div>There are no holidays yet ...</div>)
                      }
                    </Segment>
                  </Grid.Column>
                
                  <Grid.Column width={11}>
                    <Segment>
                      {items ? 
                          ( <div>
                              <h4>My wishlist</h4>
                              <Grid stackable columns={3}>
                              {items.map(item => (
                                <Grid.Column key={item.id}>
                                <Card centered>
                                  <ItemPhoto url = {item.url} photoUrl = {item.image}/>
                                  
                                  <Card.Content>
                                      <a href = {item.url} target="_blank"  rel="noopener noreferrer">
                                          <Card.Header>{item.title.substring(0,50)}...</Card.Header>
                                      </a>
                                    <Card.Meta>
                                      {item.seller ? <p>Seller:  {item.seller}</p> : null}
                                      {item.price ? <p>$ {item.price}</p> : null}
                                      {item.note && item.note !== '' ? <p>Note: {item.note}</p> : null}
                                    </Card.Meta>
                                    {uid !== currentUser ? 
                                      <PurchasedItem uid = {uid} id ={item.id}/> :
                                      null
                                    }
                                    {uid !== currentUser ? 
                                      <AddItemtoWishlist mine = {false} id = {item.id} image = {item.image} title = {item.title} price = {item.price} url = {item.url}/>:
                                      null
                                    }
                                    


                                  </Card.Content>
                                </Card>
                                </Grid.Column>
                              ))} 
                            </Grid>
                        </div>
                        )
                    : 
                        (<div>There are no items ...</div>)
                    }
                    </Segment>
                  </Grid.Column>
                </Grid>
            </div>
        )
    }


}



const condition = authUser => authUser;

export default withAuthorization(condition)(withFirebase(FetchProfileInfo));




