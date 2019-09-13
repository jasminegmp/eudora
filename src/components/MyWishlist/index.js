import React from 'react';
import {Image, Card, Grid, Button} from 'semantic-ui-react';
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
          currentLanguage: null,
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

        // Grab current language selection

        this.props.firebase.getLanguage(user.uid).on('value', snapshot => {

          if (this.isUnmounted) {
              return;
          }
          
          const language = snapshot.val();

          if (language){
              this.setState({currentLanguage: language.language});
          }
          else{
              this.props.firebase.setLanguage(user.uid, 'english')
                  .catch(error => {
                      this.setState({error});
                  });
          }
          
      });

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
        const {smallerView, currentLanguage, note} = this.state;
        if (smallerView){
          return <SmallerItemList currentLanguage = {currentLanguage} items={items} note = {note} onChange = {this.onChange}/>

        }else{
          return <LargerItemList currentLanguage = {currentLanguage} items={items} note = {note} onChange = {this.onChange}/>
        }
      }

      renderAddItems = (items) =>{
        if (this.state.smallerView){
          return (
            <div>
              {this.state.currentLanguage === 'english' ? 
                    <div>There are no items ...</div>:
                    <div>아이템이 없습니다…</div>
              } 
              <br/>
              <Link to = {ROUTES.SHOP_ETSY}><Button style = {{marginTop: "20px"}} >+ Add items</Button></Link>
            </div>
          )

        }else{
          return (
            <div style = {{margin: "100px", textAlign: "center"}}>
              {this.state.currentLanguage === 'english' ? 
                    <div>There are no items ...</div>:
                    <div>아이템이 없습니다…</div>
              } 
              <br/>
              <Link to = {ROUTES.SHOP_ETSY}><Button style = {{marginTop: "20px"}} >
              {this.state.currentLanguage === 'english' ? 
                    <div>+ Add items</div>:
                    <div>+ 아이템 추가</div>
              }   
              </Button></Link>
            </div>
          )
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
                
                this.renderAddItems(items) 
            )}
          </div>
        );
      }
}

const LargerItemList = ({ items , currentLanguage}) => (
  <Grid style = {{margin: 70}} stackable columns={4}>
    {items.map(item => (
      <Grid.Column key={item.id}>
      <Card centered>
        
          <ItemPhoto url = {item.url} photoUrl = {item.image}/>
        
        <Card.Content>
            <a href = {item.url} target="_blank" rel="noopener noreferrer">
                <Card.Header>{item.title.substring(0,40)}...</Card.Header>
            </a>
          
          {item.seller ? 
            <Card.Meta>
              {currentLanguage === 'english' ? 
              <div>Seller: {item.seller}</div>:
              <div>판매자: {item.seller}</div>
              }
            </Card.Meta> 
          : null}
          {item.price ? <Card.Meta>$ {item.price}</Card.Meta>: null}

          <Card.Meta>
            {item.note && item.note !== '' ? 
              <div>
                {currentLanguage === 'english' ? 
                  <p>Note: {item.note}</p> :
                  <p>메모: {item.note}</p> 
                }
              </div>
            : null}
          </Card.Meta>

          <UpdateNoteInWishlist id = {item.id}/>
          <RemoveItemFromWishlist id = {item.id}/>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);

const SmallerItemList = ({ items , currentLanguage}) => (
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
    <Grid.Column>
      <Link to={ROUTES.MY_WISHLIST}>
        <button style={{width: "100%", margin: "auto", marginBottom: "10px"}} className = "ui button " type = "button">
          {currentLanguage === 'english' ? 
            <div>See Entire Wishlist</div>:
            <div>내 위시리스트</div>
          } 
        </button>
      </Link>
    </Grid.Column>
    <Grid.Column>
      <Link to={ROUTES.SHOP_ETSY}>
        <button style={{width: "100%", margin: "auto", marginBottom: "10px"}} className = "ui button " type = "button"  >
          
          {currentLanguage === 'english' ? 
            <div>+ Add Items</div>:
            <div>+ 위시리스트에 추가</div>
          } 
        </button>
      </Link>
    </Grid.Column>
   </Grid>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistBase);
