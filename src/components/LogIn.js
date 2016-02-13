import React, {
  TextInput,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {
  white,
  primaryColor,
  primaryColorHover,
  whiteSmoke,
} from '../lib/colors';
import {vw, vh} from '../lib/viewPercentages';
import request from 'superagent';

var LogIn = React.createClass ({
  getInitialState() {
    state = {
      login: false,
      userEmail: '',
      userPassword: '',
    };

    return state;
  },

  onPressSubmit() {
    request
      .post('https://www.zeemee.com/users/sign_in.json')
      .send({user: {email: this.state.userEmail, password: this.state.userPassword}})
      .set('X-User-Token', 'none')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if(err) {
          this.setState({ loginFailed: true });
        } else {
          this.props.signInUser(res);
        }
      })
  },

  render() {
    var failedLoginContents = this.state.loginFailed ? 'login failed' : '';

    return (
      <View style={styles.viewContainer}>
        <Image
          style={styles.logo}
          source={{uri: 'http://brv.com/wp-content/uploads/2015/10/ZeeMee-Logo-Original.png'}}
          resizeMode={'contain'} />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoFocus={true}
          autoCapitalize={'none'}
          placeholder={'email'}
          onChangeText={(userEmail) => this.setState({userEmail})} />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          secureTextEntry={true}
          autoCapitalize={'none'}
          placeholder={'password'}
          onChangeText={(userPassword) => this.setState({userPassword})} />
        <TouchableHighlight
          style={styles.submit}
          underlayColor={primaryColorHover}
          onPress={this.onPressSubmit}>
          <Text style={{color: white}}>
            submit
          </Text>
        </TouchableHighlight>
        <Text style={styles.failedLogin}>
          {failedLoginContents}
        </Text>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: vh(100) - 20,
    backgroundColor: whiteSmoke,
  },

  logo: {
    width: vw(50),
    height: vh(16),
    position: 'relative',
    top: -20,
  },

  input: {
    width: vw(60),
    height: 30,
    marginBottom: 3,
    alignSelf: 'center',
    backgroundColor: white,
    borderRadius: 5,
    paddingLeft: 5,
  },

  submit: {
    width: vw(60),
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: primaryColor,
  },

  failedLogin: {
    marginTop: 5,
    color: 'red',
  }
});

module.exports = LogIn;