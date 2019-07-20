import React, {Component} from 'react';
import {Container, Message, Segment} from 'semantic-ui-react'

export default class NotFound extends Component{
	render(){
		return(
			<Container>
			<Segment placeholder>
			<Message negative>
				<Message.Header>
				We are unable to redirect you to the above url.
				</Message.Header>
				<p>Please check the url and try again.</p>
			</Message>
			</Segment>
			</Container>	
		)
	}
}