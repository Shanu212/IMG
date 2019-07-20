import React, {Component} from 'react'
import Service from './indexService'
import {Comment, Form, Button, Header, Container} from 'semantic-ui-react'
import RefreshedToken from './rtoken';


const service = new Service();
export default class FeedComment extends Component {
	constructor(props){
		super(props)
		this.state = {
			comment: '',
			comments: this.props.comments
		}
		this.handleChange = this.handleChange.bind(this)
		this.onComment = this.onComment.bind(this)
	}

	handleChange = (event, {value}) => {
		this.setState({comment: value})
	}

	onComment(){
		this.props.onComment(this.state.comment, this.props.meeting_id)
	}

    componentDidMount(){
        console.log(this.props.comments)
        console.log(this.props.usern.refresh)
    }

    deleteMeet(){
        RefreshedToken(this.props.usern.refresh)
        .then(response => {
            service.delMeet(this.props.access, this.props.meeting_id)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    renderbutton(){
        if(this.props.usern.username == this.props.creatern){
            return (
                <Container>
                <Form.TextArea onChange={this.handleChange}/>
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary size='mini' onClick={this.onComment}/>

                <Button size='mini' secondary name='delete' floated='right' onClick={this.deleteMeet}>
                    Delete
                </Button>   
                <Button size='mini' secondary name='update' floated='right' onClick={this.updMeet}>
                    Update
                </Button>
                </Container>
            );
        } else {
            return (
            <Container>
                <Form.TextArea onChange={this.handleChange}/>
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary size='mini' onClick={this.onComment}/>  
            </Container>
            );
        }
    }


	render(){
		var {comments} = this.state
		return(
			<Container>
                <Comment.Group size='tiny'>
                    <Header size='small' dividing>
                    Comments
                    </Header>

                    {comments.map(comment => {
                        return (<Comment key={comment.id}>
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author>{comment.username}</Comment.Author>
                            <Comment.Metadata>
                            <div>{comment.time.slice(0, 10)} at {comment.time.slice(11, 19)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.comment}</Comment.Text>
                        </Comment.Content>
                        </Comment>)
                    }
                    )}
                    
                    <Form reply>
                        {this.renderbutton()}
                    </Form>
                </Comment.Group>
            </Container>
		);
	}

}