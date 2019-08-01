import React, { Component } from 'react'
import {Menu, Segment, Container, Form, Message, Button} from 'semantic-ui-react';
import Service from './indexService';
const service = new Service();

export default class Authenticate extends Component {

    constructor(props){
        super(props)
        this.state = {
            error: false,
            success: false,
            errormsg: [],
        }
        this.failure = this.failure.bind(this)
        this.success = this.success.bind(this)
    }

    listError = (errorObject=undefined) => {
        var errormsg = []
        if(errorObject !== undefined){
            for(var property in errorObject){
                if(errorObject.hasOwnProperty(property))
                    errormsg.push(errorObject[property])
            }
        } 
        else
            errormsg.push("Something went wrong.")  
        this.setState({ errormsg: errormsg})
    } 

    handleChange = (event, props) =>{
        var { value, name, checked } = props
        if(checked === undefined)
            this.setState({[name]: value})
        else
            this.setState({[name]: checked})
    }

    handleSubmit = (event) => {
        var { first_name, is_staff, username, password, email } = this.state
        var data = {}
        data['first_name'] = first_name
        data['is_staff'] = is_staff 
        data['username'] = username
        data['email'] = email
        data['password'] = password
        service.createUser(data)
        .then(response => {
            this.success()
        })
        .catch(error => {
            this.failure(error)
        })
    }


    success(){
        this.setState({error: false, success: true, errormsg: []})
    }


    failure(error){
        this.setState({error: true, success: false})
        this.listError(error.response.data)
    }


    render() {
        return (
            <div>
            <Menu size='large'>
                <Menu.Menu position='right'>
                    <Button basic color='blue' icon='signup' content='SIGN UP' href='/signup' />
                    <Button basic color='blue' icon='sign-in' content='SIGN IN' href='/' />
                    <Button basic color='blue' icon='google' content='G SIGN UP' href='/google'/>
                </Menu.Menu>
            </Menu>    
    
                <Container relaxed='very' stackable>
                    <Segment placeholder size='mini'> 
                    <Form onSubmit={this.handleSubmit} error={this.state.error} success={this.state.success}>
                            <Form.Input 
                                iconPosition='left' 
                                icon='user' 
                                label='Username' 
                                placeholder='Username' 
                                name='username' 
                                required 
                                onChange={this.handleChange} 
                            /><br/>
                            <Form.Input 
                                iconPosition='left' 
                                icon='user outline' 
                                label='Full Name'
                                name='first_name' 
                                placeholder='First Name' 
                                required 
                                onChange={this.handleChange} 
                            /><br/>  
                            <Form.Input 
                                iconPosition='left' 
                                icon='mail' 
                                label='Email' 
                                placeholder='Email' 
                                name='email' 
                                type='email' 
                                required 
                                onChange={this.handleChange} 
                            /><br/>    
                            <Form.Input 
                                iconPosition='left' 
                                icon='lock' 
                                label='Password' 
                                placeholder='Password' 
                                name='password' 
                                type='password' 
                                required 
                                onChange={this.handleChange} 
                            /><br/>
                            <Form.Checkbox 
                                label='Are you an admin?' 
                                name='is_staff' 
                                onChange={this.handleChange}
                            />
                                <Message icon='check' success header="Success!" />
                                <Message icon='warning sign' error header="Action Forbidden!" list={this.state.errormsg}/>
                            <Form.Button size='large' type='submit' basic color='blue' content='Sign up'/>
                    </Form>
                    </Segment>     
                </Container>
            </div>
        )
    }
}