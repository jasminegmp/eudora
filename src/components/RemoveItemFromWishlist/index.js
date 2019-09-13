import React from 'react';
import {Button} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class RemoveItemFromWishlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            currentLanguage: null,
            error: null
        };

    }

    componentDidMount(){

        // Grab current language selection
        const user = this.props.firebase.currentUser();
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
    }

    handleClick = (event) => {
        const {id} = this.state;

        event.preventDefault();

        const user = this.props.firebase.currentUser();
        //console.log(id);
        this.props.firebase.removeWishlistDb(user.uid, id)
            .then(() => {
                if (this.isUnmounted) {
                    return;
                }
                this.setState({
                    id: '',
                    error: null
                });
            })

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }
      

    render(){
        const {currentLanguage} = this.state;
        return(
            <div>
                <Button style = {{marginTop: "5px"}} className = "red" onClick = {this.handleClick}>
                    
                    {currentLanguage === 'english' ? 
                        <div>Remove item</div>:
                        <div>아이템 취소</div>
                    } 
                </Button>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RemoveItemFromWishlist);
