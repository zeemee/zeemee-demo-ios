/* @flow */
'use strict';

import React, {
  View,
  Text,
  AppRegistry,
} from 'react-native';
import Relay from 'react-relay';
import LogIn from './src/components/LogIn';
import UserSearch from './src/components/UserSearch'
import ViewerRoute from './src/routes/ViewerRoute';

class fix extends React.Component {
  constructor() {
    super();
    this.state = { loggedIn: false };
    this.signInUser = this.signInUser.bind(this);
  }

  signInUser(http_response) {
    var data = JSON.parse(http_response.text),
        userToken = data.authentication_token,
        userEmail = data.email;

    // Setup relay's network layer.
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer(
        `https://www.zeemee.com/api/graph.json`, {
          credentials: 'include',
          headers: {
            'X-User-Token': userToken,
            'X-User-Email': userEmail,
          },
        }
      )
    );

    this.setState({ loggedIn: true })
  }

  render() {
    var contents,
        viewerRoute = new ViewerRoute();

    if(this.state.loggedIn) {
      contents = <Relay.RootContainer
                   Component={UserSearch}
                   route={viewerRoute} />
    } else {
      contents = <LogIn signInUser={this.signInUser}/>
    }

    return contents;
  }
}

AppRegistry.registerComponent('fix', () => fix);
