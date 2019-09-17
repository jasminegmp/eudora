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
        const {uid} = this.state;

        // Grab current language selection

        this.props.firebase.getLanguage(uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();

            if (language){
                this.setState({currentLanguage: language.language});
            }
            else{
                this.props.firebase.setLanguage(uid, 'english')
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
        const {uid} = this.state;

        event.preventDefault();
        this.setState({newLanguage: 'english'});
        this.props.firebase.setLanguage(uid, 'english')
        .catch(error => {
            this.setState({error});
        });
        this.switchLanguages();
    }

    clickKorean = (event) => {
        const {uid} = this.state;

        event.preventDefault();
        this.setState({newLanguage: 'korean'});
        this.props.firebase.setLanguage(uid, 'korean')
        .catch(error => {
            this.setState({error});
        });
        this.switchLanguages();
    }

    switchLanguages = (event) =>{
        const {newLanguage, currentLanguage} = this.state;

        // we need to change!
        if (newLanguage !== currentLanguage){
            this.setState({currentLanguage: newLanguage});

            window.location.reload();
            
        }

        //otherwise it's okay to keep the language the way it is
    }


    render() {
        const {error} = this.state;

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

