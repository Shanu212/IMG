import React, {Component} from 'react';
import { Message, Form, Button, Dropdown, Container, Segment } from 'semantic-ui-react';
import RefreshedToken from './rtoken';
import Service from '../indexService';
import {
	DateInput,
	TimeInput,
} from 'semantic-ui-calendar-react';

var service = new Service();
const options = [
	{ key: 'General', text: 'General', value: 'General' },
  	{ key: 'Private', text: 'Private', value: 'Private' },
]

export default class MeetAdd extends Component{
	constructor(props){
		super(props);
		this.state = {
			date: '',
			time: '',
			purpose: '',
			meeting_on: '',
			venue: '',
			meet_type: '',
			soptions: [],
			sop: [],
			allOpt: '',
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
                this.setState({soptions: response.map(user => {
                		return {key: user.id, value: user.id, text: user.username}
                	}
                )})
                this.setState({sop: this.state.soptions.filter(x => x.key !== this.props.user.id)})
                this.setState({allOpt: response.map(user => {return user.id})})
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
		var {meeting_on, purpose, date, time, venue, participants, meet_type, allOpt} = this.state
		data['meeting_on'] =  date.slice(6,10) + "-" + date.slice(3,5) + "-" + date.slice(0,2) + "T" + time + ":00" + "Z"
		data['purpose'] = purpose
		data['venue'] = venue
		data['meet_type'] = meet_type
		if(meet_type==='Private'){
			participants.push(this.props.user.id)
			data['participants'] = participants
		}
		else{
			data['participants'] = allOpt
		}	
		RefreshedToken(this.props.user.refresh)
		.then(response => {
            service.createMeet(data, response.data.access)
            .then(response => {
                this.setState({error: false, success: true})
            })
            .catch(error => {
                console.log(error)
                this.setState({error: true, success: false})
            })
        })
	}

	handleChange = (event, {name, value}) => {
    	this.setState({ [name]: value });
  	}

	render(){
		var {error, success} = this.state
		const enabled = (this.state.meet_type === 'Private')
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
        		/>
        		<Form.Select 
        			required
        			name='meet_type'
        			onChange={this.handleChange}
        			label='Meeting type' 
        			options={options} 
        			placeholder='Type'
        		/>
        		<Dropdown multiple search clearable selection
        			label='participants'
        			placeholder='participants'
        			disabled={!enabled}
        			options={this.state.sop}
        			onChange={this.adropdown}
        		/><br />
        			<Message success header="Success!" />
        			<Message error header="Failed!" content="Make sure date-time is in correct format and you are logged in..." />
        		<Button type="submit" basic color='blue'>Create Meet</Button>
        	</Form>
           	</Segment>
        	</Container>
		);
	}
}	