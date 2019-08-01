import React, { Component } from 'react'
import { Menu, Container, Message, Button } from 'semantic-ui-react';
import GoogleLogin from 'react-google-login'
import Service from './indexService';

const service = new Service();

export default class Signin extends Component {

	constructor(props){
        super(props)
        this.state = {
            redirect: false,
            success: false,
            failure: false
        }
        this.signup = this.signup.bind(this);
    }
    
    signup(res){
        var {ofa, ig, U3, Eea} = res.w3;
        var data = {};
        data['username'] = ofa
        data['first_name'] = ig
        data['password'] = Eea
        data['email'] = U3
        data['is_staff'] = 'false'
        service.createUser(data)
        .then(response => {
            this.setState({success: true})
        })
        .catch(error => {
            console.log(error)
            this.setState({failure: true})
        })
    }             

	render(){

        const responseGoogle = (response) => {
            console.log(response);
            this.signup(response);
        }   
        
        if(this.state.success){
            return (
               <Container> 
                <Message success header='Account Created' content='Your password is your googleId and username is your first name as mentioned in your email account.'/>
                <a href='http://localhost:3000'>Signin now</a> 
                </Container>
            )
        }

        if(this.state.failure){
            return (
            <Container>
            <Message error header='Action Forbidden!' content='Your account already exists or wrong data entered.'/>
            <a href='http://localhost:3000/google'>TRY AGAIN</a> 
            </Container>
            )
        }

		return(
			<div>
            <Menu size='large'>
                <Menu.Menu position='right'>
                    <Button basic color='blue' icon='signup' content='SIGN UP' href='/signup' />
                    <Button basic color='blue' icon='sign-in' content='SIGN IN' href='/' />
                    <Button basic color='blue' icon='google' content='G SIGN UP' href='/google'/>
                </Menu.Menu>
            </Menu>
            <Container textAlign='center'>
                <GoogleLogin
                    clientId="528296198821-eb41mvpj9qqu0rgipsplv0tifivtn002.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                    buttonText="LOGIN WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                />
            </Container>
            </div>
		)
	}
}