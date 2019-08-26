import React from 'react';
import {Image, Card, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import RemoveItemFromWishlist from '../RemoveItemFromWishlist';


class WishlistBase extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          smallerView: null,
          note: '',
          id: null,
          items: [],
        };
      }
    
      componentDidMount() {
        if (this.props.smallerView){
          this.setState({smallerView: true});

        }
        else{
          this.setState({smallerView: false});

        }
        this.setState({ loading: true });
        const user = this.props.firebase.currentUser();
        this.props.firebase.items(user.uid).on('value', snapshot => {
    
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

      renderItems = (items) =>{
        if (this.state.smallerView){
          return <SmallerItemList items={items} note = {this.state.note} onChange = {this.onChange}/>

        }else{
          return <LargerItemList items={items} note = {this.state.note} onChange = {this.onChange}/>
        }
      }

    
      render() {
        const { items, loading, smallerView} = this.state;
        return (
          <div>
            {loading && <div>Loading ...</div>}
            {items ? (
                  this.renderItems(items) 
            ) : (
                <div>There are no items ...</div>
            )}
          </div>
        );
      }
}

const LargerItemList = ({ items }) => (
  <Grid style = {{margin: 70}} stackable columns={4}>
    {items.map(item => (
      <Grid.Column key={item.id}>
      <Card centered>
        <Image src={item.image} wrapped ui={false} />
        <Card.Content>
            <a href = {item.url} target="_blank">
                <Card.Header>{item.title.substring(0,40)}...</Card.Header>
            </a>
          
          {item.seller ? <Card.Meta>Seller: {item.seller}</Card.Meta> : null}
          {item.price ? <Card.Meta>$ {item.price}</Card.Meta>: null}

          <Card.Meta>
            {item.note && item.note !== '' ? <p>Note: {item.note}</p> : null}
          </Card.Meta>


          <RemoveItemFromWishlist id = {item.id}/>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);

const SmallerItemList = ({ items }) => (
  <Grid stackable columns={2}>
    {items.map(item => (
      <Grid.Column key={item.id}>
      <Card centered>
        <Image src={item.image} wrapped ui={false} />
        <Card.Content>
            <a href = {item.url} target="_blank">
                <Card.Header>{item.title.substring(0,40)}...</Card.Header>
            </a>

        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistBase);
