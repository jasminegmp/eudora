import React from 'react';
import {Icon, Form, Button} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class AddItemtoWishlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            note: '',
            mine: this.props.mine,
            title: this.props.title,
            id: this.props.id,
            image: this.props.image,
            price: this.props.price,
            url: this.props.url,
            purchased: false,
            clicked: false,
            currentLanguage: null,
            uid: this.props.firebase.currentUser().uid,
            error: null
        };

    }

    componentDidMount(){
        this.props.firebase.getLanguage(this.state.uid).on('value', snapshot => {
  
          if (this.isUnmounted) {
              return;
          }
          
          const language = snapshot.val();
  
          if (language){
              this.setState({currentLanguage: language.language});
          }
          
        });
    
    }

    handleClick = (event) => {
        const {title, id, image, price, url, purchased, note} = this.state;

        event.preventDefault();

        const user = this.props.firebase.currentUser();
        this.props.firebase.addWishlistDb(user.uid, title, url, image, id, price, purchased, note, "Etsy")
            .then(() => {
                this.setState({
                    note: '',
                    title: '',
                    id: '',
                    image: '',
                    price: '',
                    url: '',
                    purchased: '',
                    error: null
                });
            })
            .then(this.setState({clicked: true}))
            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
        ;


    }
    
    onChange = (event) => {
        this.setState({note: event.target.value});
    }

    render(){
        const {currentLanguage} = this.state;
        return(
            <div>
                { this.state.mine ?
                (
                    <div>
                        {currentLanguage === 'english' ? 
                              <label>Leave a note (optional)</label>:
                              <label>메모 (선택)</label>
                        } 
                        
                        <Form.Input style = {{width: '100%'}}
                                    name = "note"
                                    value = {this.state.note}
                                    onChange = {this.onChange}
                                    type = "text"
                                    placeholder = "Example: Size small"
                        />		
                        <Button style = {{marginTop: "5px"}} onClick = {this.handleClick} disabled={this.state.clicked} >
                        {currentLanguage === 'english' ? 
                              <div>+ Add item to wishlist</div>:
                              <div>+ 아이템 추가</div>
                        } 
                        </Button>
                    </div>
                    
                ):
                (
                    <div>
                        <Button style = {{marginTop: "5px"}} onClick = {this.handleClick} disabled={this.state.clicked} >
                        {currentLanguage === 'english' ? 
                              <div>+ Add item to my own wishlist</div>:
                              <div>+ 내 위시리스트의 추가</div>
                        } 
                        </Button>
                    </div>
                )
                }
                {this.state.clicked ? <div className ="ui red floating label">Added</div> : null}
                

            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddItemtoWishlist);
