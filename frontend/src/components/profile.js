import React, {Component} from 'react'
import Service from '../Index-service'
import { Container, Card, Image, Icon } from 'semantic-ui-react';
import RefreshedToken from './rtoken'
import Axios from 'axios';

const service = new Service()

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
      	  <Container>
            ADMIN
          </Container>
          <Container>
       		<a href="http://localhost:8000/admin/">Go to admin Page</a>  
          </Container>
        </Container>
      );
    } else {
      return (
          ""
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