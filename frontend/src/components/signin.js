import React, { Component } from 'react'
import { Menu, Segment, Container, Form, Button} from 'semantic-ui-react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Signin extends Component {

	constructor(props){
        super(props)
        this.state = {
            redirect: false,
            user: {},
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleSubmit(e){
        Axios.post("http://localhost:8000/api/token/", {
            username: this.state.user.username,
            password: this.state.user.password,
        })
        .then(response => {
            console.log(response)
            var user = {}
            user['refresh'] = response.data.refresh
            Axios.get(`http://localhost:8000/api/users/${this.state.user.username}`, {
                headers: {
                    "Authorization": "Bearer" + " " + response.data.access
                }
            })
            .then(response => {
                user = {...response.data, ...user}
                this.setState({redirect: !this.state.redirect, user: user})
            })
            .catch(err => {
                alert("Wrong credentials!!")
                console.error("Wrong credentials!!", err)
            })
        })
        .catch(err => {
            alert("Wrong credentials!!")
            console.error(err)
        })
        
    }


    handleChange(e, { name, value }){
        this.setState(state => {
            state.user[name]= value
            return state
        })
    }
    

    Redirect(){
        if(this.state.redirect === true)
            return <Redirect to={{
                       pathname: "/home",
                       state: this.state.user,
                   }} />
     }              

	render(){   
		return(
			<div>
			{this.Redirect()}
            <Menu size='large'>
                <Menu.Menu position='right'>
                    <Button basic color='blue' icon='signup' content='SIGN UP' href='/signup' />
                    <Button basic color='blue' icon='sign-in' content='SIGN IN' href='/' />
                    <Button basic color='blue' icon='google' content='G SIGN UP' href='/google'/>
                </Menu.Menu>
            </Menu>  
            <Container>
            	<Segment placeholder>
            		<Form onSubmit={this.handleSubmit}>
	                	<Form.Input
                            name='username'
                            icon='user' 
                            iconPosition='left' 
                            label='Username' 
                            placeholder='Username' 
                            onChange={this.handleChange}
                        />
    	            	<Form.Input 
                            name='password' 
                            icon='lock' 
                            iconPosition='left' 
                            label='Password' 
                            placeholder='Password' 
                            type='password' 
                            onChange={this.handleChange}
                        />

                		<Button size='large' basic color='blue' content='Login' type='submit'/>
            		</Form>
            	</Segment>
            </Container>
            </div>
		)
	}
}