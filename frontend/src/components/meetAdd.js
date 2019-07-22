import React, {Component} from 'react';
import { Message, Form, Button, Dropdown, Container, Segment } from 'semantic-ui-react';
import RefreshedToken from './rtoken';
import Service from '../indexService';
import {
	DateInput,
	TimeInput,
} from 'semantic-ui-calendar-react';

var service = new Service();

export default class MeetAdd extends Component{
	constructor(props){
		super(props);
		this.state = {
			date: '',
			time: '',
			purpose: '',
			meeting_on: '',
			venue: '',
			soptions: [],
			participants: [],
			error: false,
			success: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.adropdown = this.adropdown.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	adropdown(event, {value}){
		this.setState({participants: value})
	}

	handleChangeDate = (event, {name, value}) => {
    	if (this.state.hasOwnProperty(name)) {
      		this.setState({ [name]: value });
    	}
  	}

  	updateUsers(){
        RefreshedToken(this.props.user.refresh)
        .then(response => {
            service.listUser(response.data.access)
            .then(response => {
            	console.log(response)
                this.setState({soptions: response.map(user => {return {key: user.id, value: user.id, text: user.username}})})
            })
            .catch(error => {
            	console.log(response)
            })
        })   
    }

    componentDidMount(){
        this.updateUsers();
    }

	handleSubmit(event){
		var data = {}
		var {meeting_on, purpose, date, time, venue, participants} = this.state
		data['meeting_on'] =  date.slice(6,10) + "-" + date.slice(3,5) + "-" + date.slice(0,2) + "T" + time + ":00" + "Z"
		data['purpose'] = purpose
		data['venue'] = venue
		data['created_by'] = this.props.user.id
		data['participants'] = participants
		RefreshedToken(this.props.user.refresh)
		.then(response => {
            service.createMeet(data, response.data.access)
            .then(response => {
                console.log(response.data)
                this.setState({error: false, success: true})
            })
            .catch(error => {
                console.log(error.status)
                this.setState({error: true, success: false})
            })
        })
	}

	handleChange = (event, {name, value}) => {
    	this.setState({ [name]: value });
  	}

	render(){
		var {error, success} = this.state
		return(
			<Container>
			<Segment placeholder>
			<Form onSubmit={this.handleSubmit} error={error} success={success}>
				<Form.Input 
					required 
					label="Purpose" 
					name="purpose" 
					onChange={this.handleChange} 
				/>
				<Form.Input 
					required 
					label="Venue" 
					name="venue" 
					onChange={this.handleChange} 
				/>
				<DateInput
					required="True"
					label="Date"
          			name="date"
          			value={this.state.date}
          			iconPosition="left"
          			onChange={this.handleChangeDate}
        		/>
        		<TimeInput
        			required="True"
        			label="Time"
          			name="time"
          			value={this.state.time}
          			iconPosition="left"
          			onChange={this.handleChangeDate}
        		/><br/>
        		<Dropdown multiple search clearable selection
        			placeholder='participants'
        			options={this.state.soptions}
        			onChange={this.adropdown}
        		/><br />
        			<Message success header="Success!" />
        			<Message error header="Failed!" content="Make sure date-time is in correct format and you are logged in..." />
        		<Button type="submit" secondary>Create Meet</Button>
        	</Form>	
        	</Segment>
        	</Container>
		);
	}
}	