import React, { Component } from 'react'
import { Menu, Input, Button } from 'semantic-ui-react'

export default class Header extends Component {
  constructor(props){
    super(props);
  }
  
  render() {
    const { activeItem, onClick } = this.props
    return (
        <Menu size='big' pointing secondary>
            <Menu.Item icon='home' name='home' active={activeItem === 'home'} onClick={onClick} />
            <Menu.Item icon='plus' name='create' active={activeItem === 'create'} onClick={onClick} />
            <Menu.Menu position='right'>
              <Menu.Item icon='user' name='profile' active={activeItem === 'profile'} onClick={onClick} />
              <Menu.Item icon='log out' name='logout' active={activeItem === 'logout'} onClick={onClick} />
            </Menu.Menu>
        </Menu>
    )
  }
}