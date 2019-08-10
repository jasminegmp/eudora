import React from 'react';
import {Image, Card, Grid, Segment, Label} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import PurchasedItem from '../PurchasedItem';

class FetchProfileInfo extends React.Component {
    
    constructor(props){
        super(props);
    
        this.state = {
            firstName: '',
            lastName: '',
            uid: props.uid,
            items: [],
            loading: false,
            error: null
        }
    }

    
    componentDidMount() {
        this.setState({ loading: true });

        // Grab first name
        this.props.firebase.getFirstName(this.props.uid).on('value', snapshot => {
          const firstName = snapshot.val();
          this.setState({ firstName})
        });

        // Grab last name
        this.props.firebase.getLastName(this.props.uid).on('value', snapshot => {
          const lastName = snapshot.val();
          this.setState({ lastName})

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
        this.props.firebase.items().off();
        this.isUnmounted = true;
      }



    render() {
        const { items, loading, firstName, lastName, uid} = this.state;
        return(
            <div>
                <h1>{firstName} {lastName}</h1>
                {loading && <div>Loading ...</div>}
                {items ? 
                    ( <Segment>
                      <h4>Wishlist</h4>
                        <ItemList items={items} uid={uid}/>
                      </Segment>
                    )
                 : 
                    (<div>There are no items ...</div>)
                }
            </div>
        )
    }


}

const ItemList = ({ items }, uid) => (
    <Grid stackable columns={4}>
      {items.map(item => (
        <Grid.Column key={item.id}>
        <Card centered>
          {item.purchased ? <Label attached ="top" className = "blue">Purchased</Label> : null}
          <Image src={item.image} wrapped ui={false} />
          <Card.Content>
              <a href = {item.url} target="_blank">
                  <Card.Header>{item.title.substring(0,50)}...</Card.Header>
              </a>
            <Card.Meta>
              <p>${item.price}</p>
            </Card.Meta>
            <PurchasedItem uid = {uid} id ={item.id}/>


          </Card.Content>
        </Card>
        </Grid.Column>
      ))} 
    </Grid>
  );

const condition = authUser => authUser;

export default withAuthorization(condition)(withFirebase(FetchProfileInfo));




