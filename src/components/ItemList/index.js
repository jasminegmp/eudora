import React from 'react';
import {Image, Card, Grid, Icon} from 'semantic-ui-react';
import { withAuthorization } from '../Session';

function ItemList(props){
	console.log(props.result);
	if (props.result){
			return (
				<Grid stackable columns={5}>
					{props.result.map(item => (
					<Grid.Column key = {item.listing_id}>
					<Card centered>
						<Image src={item.Images[0].url_170x135} wrapped ui={false} />
						<Card.Content>
						<Card.Header>{item.title.substring(0,50)}...</Card.Header>
						<Card.Meta>
							<p>${item.price}</p>
						</Card.Meta>
						</Card.Content>
					</Card>
					<Card.Content extra>
						<a>
							<Icon name='plus' />
							Add item to wishlist
						</a>
					</Card.Content>
					</Grid.Column>
					))} 
				</Grid>
			);



	};
	return <div></div>
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ItemList);