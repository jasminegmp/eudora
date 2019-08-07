import React from 'react';
import {Image, Card, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const WishlistPage = () => {
    return (
        <div style = {{margin: 40}}>
          <h1>My Wishlist</h1>
          <Items/>
        </div>
    );
};

class WishlistBase extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          items: [],
        };
      }
    
      componentDidMount() {
        this.setState({ loading: true });
        const user = this.props.firebase.currentUser();
    
        this.props.firebase.items(user.uid).on('value', snapshot => {
          // convert messages list from snapshot
    
          const itemsObject = snapshot.val();
          console.log(itemsObject);

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
      }
    
      render() {
        const { items, loading } = this.state;
        return (
          <div>
            {loading && <div>Loading ...</div>}
            {items ? (
                <ItemList items={items} />
            ) : (
                <div>There are no items ...</div>
            )}
          </div>
        );
      }
}

const ItemList = ({ items }) => (
  <Grid stackable columns={4}>
    {items.map(item => (
      <Grid.Column key={item.id}>
      <Card centered>
        <Image src={item.url} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{item.title}</Card.Header>
          <Card.Meta>
            <p>{item.price}</p>
          </Card.Meta>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);


const Items = withFirebase(WishlistBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistPage);
