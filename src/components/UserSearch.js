import React from 'react-native';
import Relay from 'react-relay';

var {
  View,
  Text,
  StyleSheet,
} = React;

var UserSearch = React.createClass({
  render() {
    return (
      <View style={styles.view}>
        <Text>Viewer ID: {this.props.me.name}</Text>
      </View>
    );
  }
});

UserSearch = Relay.createContainer(UserSearch, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        name,
      }
    `,
  },
});

var styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserSearch;
