import React, {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  ListView,
} from 'react-native';
import Relay from 'react-relay';
import {white, whiteSmoke} from '../lib/colors';
import {vw, vh} from '../lib/viewPercentages';

const DEFAULT_SEARCH_TEXT = '';
const DEFAULT_FIRST_N = 8;
const DEFAULT_PROFILE_PHOTO_SIZE_N = 50;

/**
 * This is the React component. Everything here pertains
 * to the view.
 */
var UserSearch = React.createClass({
  /**
   * This is a React Component Lifecycle Method. See:
   * https://facebook.github.io/react/docs/component-specs.html#getinitialstate
   */
  getInitialState() {
    // this state represents the text that currently
    // exists in the search input.
    var state = {
      searchText: DEFAULT_SEARCH_TEXT,
    };

    return state;
  },

  /**
   * This is a React Component Lifecycle Method. See:
   * https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps, prevState) {
    if(prevState.searchText !== this.state.searchText) {
      // Every time we change the search text in the view,
      // we want to tell relay to update its query
      this.props.relay.setVariables({relaySearchText: this.state.searchText});
    }
  },

  /**
   * Called by the ListView component for each element in
   * the dataSource array.
   */
  renderRow(rowData) {
    var user = rowData.node;

    return (
      <View
        style={styles.listViewCell}>
          <Image
            style={styles.profilePhoto}
            source={{uri: user.profilePhotoUrl}}
          />
        <Text
          style={styles.userName}>
          {rowData.node.name}
        </Text>
      </View>
    );
  },

  /**
   * This is the primary React Component Lifecycle Method. It
   * is required in every react component. See:
   * https://facebook.github.io/react/docs/component-specs.html#render
   */
  render() {
    // this line is boilerplate copy/paste ListView initialization.
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    // grab the users from the prop passed into this component via
    // our Relay container.
    var users = this.props.viewer.search.edges;

    if(users.length) {
      // We're in action! Inject these results into the ListView
      var dataSource = dataSource.cloneWithRows(users);
    }

    // If you're confused by the => stuff, just ask!!
    return (
      <View style={styles.view}>
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoFocus={true}
          autoCapitalize={'none'}
          placeholder={'Commence searching'}
          onChangeText={searchText => this.setState({searchText})}
        />
        <ListView
          style={styles.listview}
          dataSource={dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
});

/**
 * This is our relay container. It serves as our model.
 */
UserSearch = Relay.createContainer(UserSearch, {
  // set the default query variables
  initialVariables: {
    relaySearchText: DEFAULT_SEARCH_TEXT,
    relayFirstN: DEFAULT_FIRST_N,
    relayProfilePhotoN: DEFAULT_PROFILE_PHOTO_SIZE_N
  },

  // this is the core of our data store. It specifies the data
  // that will be available in the component we've wrapped. No
  // more, no less.
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          search(q: $relaySearchText, first: $relayFirstN) {
            edges {
              node {
                name,
                profilePhotoUrl(size: $relayProfilePhotoN)
              }
            }
          }
        }
      `;
    }
  }
});

var styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: whiteSmoke,
  },

  input: {
    width: vw(100) - 20,
    height: 30,
    margin: 10,
    paddingLeft: 5,
    backgroundColor: white,
    borderRadius: 5,
  },

  listView: {
    padding: 10,
  },

  listViewCell: {
      flex: 1,
      flexDirection: 'row',
      padding: 12,
  },

    profilePhoto: {
        width: DEFAULT_PROFILE_PHOTO_SIZE_N,
        height: DEFAULT_PROFILE_PHOTO_SIZE_N,
        marginRight: 10
    },

    userName: {
        fontSize: 18
    }
});

export default UserSearch;
