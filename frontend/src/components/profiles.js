import React, {Component} from 'react'
import Service from '../Index-service'
import { Card, Image, Icon } from 'semantic-ui-react';
import RefreshedToken from './rtoken'
import FeedComment from './meetComment' 
import Axios from 'axios';

export default class Profiles extends Component {
	constructor(props){
		super(props);
		this.state = {
			meets: {},
      match: this.props.match.params.id
		}
	}

	render(){
		return(
        <div>
          {this.state.match}
        </div>
		);
	}
}	