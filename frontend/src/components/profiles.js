import React, {Component} from 'react'

export default class Profiles extends Component {
	constructor(props){
		super(props);
		this.state = {
			meets: {},
      match: this.props.match.params.id
		}
	}

  componentDidMount(){

  }

	render(){
		return(
        <div>
          {this.state.match}
        </div>
		);
	}
}	