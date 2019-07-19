import React from 'react';
import {Image, Card} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const HomePage = () => {
    return (
        <div>
            <h1>Home</h1>
             <p>The Home Page is accessible by every signed in user!</p>
             <Users />
        </div>
    );
};

class UsersBase extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          users: [],
        };
      }
    
      componentDidMount() {
        this.setState({ loading: true });
    
        this.props.firebase.profiles().on('value', snapshot => {
          // convert messages list from snapshot
    
          const usersObject = snapshot.val();

          if (usersObject) {
            // convert messages list from snapshot
            const usersList = Object.keys(usersObject).map(key => ({
              ...usersObject[key],
              uid: key,
            }));
      

            this.setState({ users: usersList, loading: false });
          } else {
            this.setState({users: null, loading: false });
          }
        });
      }
    
      componentWillUnmount() {
        this.props.firebase.profiles().off();
      }
    
      render() {
        const { users, loading } = this.state;
        return (
          <div>
            {loading && <div>Loading ...</div>}
            {users ? (
                <UserList users={users} />
            ) : (
                <div>There are no users ...</div>
            )}
          </div>
        );
      }
}

const UserList = ({ users }) => (
  <div className="ui stackable grid">
    {users.map(user => (
      <Card centered key={user.uid}>
        <Image src={user.photoUrl} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{user.firstName} {user.lastName}</Card.Header>
          <Card.Meta>
            <p>{user.username}</p>
          </Card.Meta>
        </Card.Content>
      </Card>
    ))} 
  </div>
);


const Users = withFirebase(UsersBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
