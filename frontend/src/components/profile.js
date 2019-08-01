import React, {Component} from 'react'
import { Container, Card, Image, Icon } from 'semantic-ui-react';

export default class Profiles extends Component {
	constructor(props){
		super(props);
		this.state = {
			meets: {},
		}
	}

	renderButton() {
    if(this.props.user.is_staff) {
      return (
      	  <Container>
      	   	<Icon name='user' /> 
            ADMIN
          </Container>
      );
    } else {
      return (
        <Container>
            <Icon name='user' /> 
            NORMAL USER
          </Container>  
      );
    }
}

	render(){
		return(
			<Card>
    			<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
    			<Card.Content>
      				<Card.Header>{this.props.user.username}</Card.Header>
      				<Card.Meta>{this.props.user.first_name}</Card.Meta>
      				<Card.Description>
        				email: {this.props.user.email}
      				</Card.Description>
    			</Card.Content>
    			<Card.Content extra>
        			 {this.renderButton()}
    			</Card.Content>
  			</Card>
		);
	}
}	