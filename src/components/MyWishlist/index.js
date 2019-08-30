import React from 'react';
import {Image, Card, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import RemoveItemFromWishlist from '../RemoveItemFromWishlist';
import ItemPhoto from '../ItemPhoto';
import UpdateNoteInWishlist from '../UpdateNoteInWishlist';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';


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
        const { items, loading} = this.state;
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
        
          <ItemPhoto url = {item.url} photoUrl = {item.image}/>
        
        <Card.Content>
            <a href = {item.url} target="_blank" rel="noopener noreferrer">
                <Card.Header>{item.title.substring(0,40)}...</Card.Header>
            </a>
          
          {item.seller ? <Card.Meta>Seller: {item.seller}</Card.Meta> : null}
          {item.price ? <Card.Meta>$ {item.price}</Card.Meta>: null}

          <Card.Meta>
            {item.note && item.note !== '' ? <p>Note: {item.note}</p> : null}
          </Card.Meta>

          <UpdateNoteInWishlist id = {item.id}/>
          <RemoveItemFromWishlist id = {item.id}/>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);

const SmallerItemList = ({ items }) => (
  <Grid stackable columns={2}>
    {items.slice(0, 4).map(item => (
      <Grid.Column key={item.id}>
      <Card centered>
        <a href = {item.url} target="_blank"  rel="noopener noreferrer"><Image style = {{margin: "auto", width: "200px", height: "200px", objectFit: "cover"}} src={item.image} /></a>
        <Card.Content>
            <a href = {item.url} target="_blank"  rel="noopener noreferrer">
                <Card.Header>{item.title.substring(0,40)}...</Card.Header>
            </a>

        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
    <br/>
  <Link to={ROUTES.MY_WISHLIST} style={{width: "100%", margin: "auto", marginBottom: "10px"}}>
   <button className = "ui button " type = "button"  >See Entire Wishlist</button>
   </Link>
   </Grid>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistBase);
