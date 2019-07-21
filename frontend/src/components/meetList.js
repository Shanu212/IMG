import React, {Component} from 'react'
import Service from './indexService'
import { Segment, Feed, Accordion, Tab, Item, Container, Button } from 'semantic-ui-react';
import RefreshedToken from './rtoken'
import FeedComment from './meetComment' 
import Axios from 'axios';

const service = new Service()

export default class MeetList extends Component {
	constructor(props){
		super(props)
		this.state = {
			meetings : [],
			comments : {},
			websocket: {},
			activeIndex: -1,
			access: '',
		}
		this.handleClick = this.handleClick.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.UpdateComments = this.UpdateComments.bind(this);
	}

	componentDidMount(){
		var {user} = this.props
		this.UpdateComments();

		RefreshedToken(user.refresh).then(response => {
			this.setState({access: response.data.access})
			service.getMeet(response.data.access)
			.then(response => {
				this.setState({meetings: response})
			})
			.catch(error => {console.log(error)})
		})
		.catch(error => console.log(error))

		var websocket = new WebSocket("ws://localhost:8000/ws/comment/")

		websocket.onmessage = (event) => {
			var comment = JSON.parse(event.data).comment
			var {comments} = this.state
			if(comments[comment.meet] == undefined)
				comments[comment.meet] = []
			comments[comment.meet].push(comment)
			this.setState({comments: comments})
		}
		websocket.onopen = (event) => {console.log('opened')}
		websocket.onclose = (event) => {console.log('closed')}
		websocket.onerror = (event) => {console.log('error')}
		this.setState({websocket: websocket})
	}

	UpdateComments(){
		Axios.get(`http://localhost:8000/api/comments/`)
		.then(response => {
			var comments = {}
			response.data.map(comment => {
				if(comments[comment.meet] == undefined)
					comments[comment.meet] = []
				comments[comment.meet].push(comment)
			})
			this.setState({comments: comments})
			console.log(response)
		})
		.catch(error => {
			console.log(error)
		})
	}

	handleClick(e, titleProps){
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex }) 
          
    }

    handleComment(text, meeting_id){
		var comment = {
			'meet': meeting_id,
			'comment': text,
			'user': this.props.user.id
		}
		this.addComment(comment)
		.then(data => {
			var { websocket } = this.state
			websocket.send(JSON.stringify(data))
		})
		.catch(error => {console.log(error)})
	}

	addComment(comment){
		return Axios.post("http://localhost:8000/api/comments/", comment)
		.then(response => response.data)
		.catch(error => { console.log(error) })
	}

	renderbutton(created_by, created_on, venue){
		if(this.props.user.username==created_by){
			return (
				<Feed.Extra text>
				 	{"YOU created a meeting on " + created_on.slice(5, 10) + " at " + created_on.slice(11, 19)+ "."}
				 </Feed.Extra>
      		);
    	} else {
      		return (
      			<Feed.Extra text>
        	   	{created_by.toUpperCase() + " has invited you for a meeting at " + venue  + " on " + created_on.slice(5, 10) + " at " + created_on.slice(11, 19)+ "."}
        	   	</Feed.Extra>
      		);
    	}
	}

	render(){
		console.log(this.state)
		var meetfeed = (meeting) => <Segment>
									<Feed size='small'>
										<Feed.Event>
                                        <Feed.Label image={'https://react.semantic-ui.com/images/avatar/small/matt.jpg'} />
                                        <Feed.Content>
                                            <Feed.Date content={meeting.created_on.slice(5, 10) + "-" + meeting.created_on.slice(0, 4) + " at " + meeting.created_on.slice(11, 16) + "."} />
                                            <Feed.Summary content={meeting.purpose.toUpperCase()} />

                                        	<Feed.Extra text>
                                            	{this.renderbutton(meeting.created_by, meeting.meeting_on, meeting.venue)}
                                            </Feed.Extra>
                                        </Feed.Content>
                                        </Feed.Event>
                                     </Feed>
                                     </Segment>

		var AccordionItem = (meeting) => {
									var { meeting_id } = meeting
                                    var { activeIndex, comments, user } = this.state
                                    if(comments[meeting_id] == undefined)
                                        comments[meeting_id] = []
                                    return (<Item key={meeting_id}>
                                        <Accordion.Title active={activeIndex === meeting_id} index={meeting_id} onClick={this.handleClick}>
                                            {meetfeed(meeting)}
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === meeting_id}>
                                            <FeedComment comments={comments[meeting_id]} onComment={this.handleComment} meeting_id={meeting_id} access={this.state.access} usern={this.props.user} creatern={meeting.created_by}/>
                                        </Accordion.Content>
                                    </Item>)
								}

		var panes = [{
						render: () => <Tab.Pane>
							<Accordion fluid styled>
								{this.state.meetings
									.map(meeting => AccordionItem(meeting))}
							</Accordion>
						</Tab.Pane>	
				}
		]

		return(
		<Tab panes={panes} />
		);						
	}

} 