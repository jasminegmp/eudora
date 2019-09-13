import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment, Button} from 'semantic-ui-react';



// a form
class ChangeLanguageForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newLanguage: null,
            currentLanguage: null,
            uid: this.props.firebase.currentUser().uid,
            error: null
        }
    }

    componentDidMount(){
        // Grab current language selection

        this.props.firebase.getLanguage(this.state.uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();

            if (language){
                this.setState({currentLanguage: language.language});
            }
            else{
                this.props.firebase.setLanguage(this.state.uid, 'english')
                    .catch(error => {
                        this.setState({error});
                    });
            }
            
        });

  
    }

    componentWillUnmount() {
        this.props.firebase.getLanguage().off();
        this.isUnmounted = true;
      }

    clickEnglish = (event) => {
        event.preventDefault();
        this.setState({newLanguage: 'english'});
        this.props.firebase.setLanguage(this.state.uid, 'english')
        .catch(error => {
            this.setState({error});
        });
        this.switchLanguages();
    }

    clickKorean = (event) => {
        event.preventDefault();
        this.setState({newLanguage: 'korean'});
        this.props.firebase.setLanguage(this.state.uid, 'korean')
        .catch(error => {
            this.setState({error});
        });
        this.switchLanguages();
    }

    switchLanguages = (event) =>{
        const {newLanguage, currentLanguage, uid, error} = this.state;

        // we need to change!
        if (newLanguage !== currentLanguage){
            this.setState({currentLanguage: newLanguage});

            window.location.reload();
            
        }

        //otherwise it's okay to keep the language the way it is
    }


    render() {
        const {password, passwordConfirm, error} = this.state;

        const isInvalid = 
            password !== passwordConfirm ||
            password === '';

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <Button onClick = {this.clickEnglish} style = {{fontSize: "30px"}}>🇺🇸</Button>
                    <Button onClick = {this.clickKorean} style = {{fontSize: "30px"}}>🇰🇷</Button>

                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

export default withFirebase(ChangeLanguageForm);

