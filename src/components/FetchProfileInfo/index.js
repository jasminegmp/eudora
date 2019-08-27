import React from 'react';
import {Image, Card, Grid, Segment} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import PurchasedItem from '../PurchasedItem';

class FetchProfileInfo extends React.Component {
    
    constructor(props){
        super(props);
    
        this.state = {
            currentUser: '',
            firstName: '',
            lastName: '',
            uid: props.uid,
            holidays: [],
            items: [],
            loading: false,
            error: null
        }
    }

    
    componentDidMount() {
      
        this.setState({ loading: true });

        this.setState({currentUser: this.props.firebase.currentUser().uid});

        // Grab first name
        this.props.firebase.getFirstName(this.props.uid).on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }
          const firstName = snapshot.val();
          this.setState({ firstName})
        });

        // Grab last name
        this.props.firebase.getLastName(this.props.uid).on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }
          const lastName = snapshot.val();
          this.setState({ lastName})

        });

        // Grab holidays
        this.props.firebase.getHolidays(this.props.uid).on('value', snapshot => {
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
        this.props.firebase.items(this.props.uid).on('value', snapshot => {
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
        const { items, loading, firstName, lastName, holidays} = this.state;
        return(
            <div>
                <h1>{firstName} {lastName}</h1>
                {loading && <div>Loading ...</div>}
                <Segment>
                  {holidays ? 
                      ( <div>                        
                          <h4>Holidays Celebrated</h4>
                          {holidays.map(holiday => (
                            
                            <div  key ={holiday.holiday}>
                            {holiday.celebrated ?
                              <p><em>{holiday.holiday}</em>
                            {holiday.date ? " on " + holiday.date.substring(5,10) : null} </p>: null}
                            
                            </div>
                          ))}
                        </div>

                      )
                  : 
                      (<div>There are no holidays yet ...</div>)
                  }
                </Segment>
                <Segment>
                {items ? 
                    ( <div>
                        <h4>Wishlist</h4>
                        <Grid stackable columns={4}>
                        {items.map(item => (
                          <Grid.Column key={item.id}>
                          <Card centered>
                            <Image src={item.image} wrapped ui={false} />
                            <Card.Content>
                                <a href = {item.url} target="_blank"  rel="noopener noreferrer">
                                    <Card.Header>{item.title.substring(0,50)}...</Card.Header>
                                </a>
                              <Card.Meta>
                              {item.seller ? <p>Seller:  {item.seller}</p> : null}
                              {item.price ? <p>$ {item.price}</p> : null}
                                <Card.Meta>
                                  {item.note && item.note !== '' ? <p>Note: {item.note}</p> : null}
                                  
                                </Card.Meta>
                              </Card.Meta>
                              {this.state.uid !== this.state.currentUser ? 
                                <PurchasedItem uid = {this.state.uid} id ={item.id}/> :
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
            </div>
        )
    }


}



const condition = authUser => authUser;

export default withAuthorization(condition)(withFirebase(FetchProfileInfo));




