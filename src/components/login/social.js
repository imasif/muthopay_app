"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage } from 'react-native';
import { Button, Spinner, Icon } from 'native-base';
import { Facebook,Google } from 'expo';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';


import { _navigateTo } from '../Helper';

import config from '../config';

const serverAddr = 'http://192.168.1.140/';

var app_id = '287493681972486';
const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class SocialLoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loginLoader: false
  }

  _handleFacebookLogin = async () => {
    try {
      //check if storage has a profile
      const value = await AsyncStorage.getItem('profile');
      console.log('asyncstorage getitem 1st', value);
      console.log('value null', value == null);

      if (value !== null) {
        // We have data!!
        console.log('shoud navigate to Main')
        _navigateTo('Main',this);
        return;
      }
      this.setState({ loginLoader: true })
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        app_id, // facebook app id
        { permissions: ["public_profile","email","user_birthday"] },
      );

      switch (type) {
        case 'success': {
          // Get the user's info using Facebook's Graph API
          let response = await fetch(`https://graph.facebook.com/me?fields=name,locale,timezone,gender,birthday,location,picture,email&access_token=${token}`);
          let profile = await response.json();

          console.log('profile',profile);
          
          var postData =
            {
              "appID": app_id,
              "uid": profile.id,
              "username": profile.id,
              "name": profile.name,
              "locale": profile.locale,
              "timezone": profile.timezone,
              "gender": profile.gender ? profile.gender : null,
              "birthday": profile.birthday ? profile.birthday : null,
              "bio": profile.about ? profile.about : null,
              "locationName": profile.location ? profile.location.name : null,
              "email": profile.email ? profile.email : null,
              "picture": profile.picture ? profile.picture.data.url : null,
              "pictureLarge": "https://graph.facebook.com/" + profile.id + "/picture?width=300&height=300"
            };

          // console.log("profile Line71", postData);

          // console.log("postData Line76", postData);
          const server_response = {};
          await fetch(`${config.host}/signup/facebook`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postData)
          })
            .then((res) => res.json())
            .then((res) => {
              server_response = res;
            })
            .catch((err) => {
              console.log('Cannot post profile to server, error:', err);
            });
          
          console.log(server_response);
          const AccessToken = server_response.AccessToken;
          const User = server_response.user;

          //saving profile to AsyncStorage storage
          await AsyncStorage.setItem('profile', JSON.stringify(User));
          //saving access_token to AsyncStorage storage
          await AsyncStorage.setItem('access_token', AccessToken);

          _navigateTo('Main', this);

          break;
        }
        case 'cancel': {
          Alert.alert(
            'Cancelled!',
            'Login was cancelled!',
          );
          this.setState({loginLoader: false});
          break;
        }
        default: {
          Alert.alert(
            'Oops!',
            'Login failed!',
          );
          this.setState({loginLoader: false});
        }
      }
    } catch (e) {
      /*Alert.alert(
      'Oops! Main catch',
      'Login failed!',
      );*/
      this.setState({loginLoader: false});

      console.log(JSON.stringify(e));
    }
  };

  _handleGoogleLogin = async () => {
    try {
      const { type, user } = await Google.logInAsync({
        androidClientId: '508020220276-70306llsji7mbgvpm1luld77ioksjgkm.apps.googleusercontent.com',
        iosClientId: '508020220276-s0lbkl9rigb0jle59tlar2pvq7hsotf3.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        behavior: 'system'
      });

      switch (type) {
        case 'success': {
          console.log('user',user);
          Alert.alert(
            'Logged in!',
            `Hi ${user.name}!`,
          );
          break;
        }
        case 'cancel': {
          Alert.alert(
            'Cancelled!',
            'Login was cancelled!',
          );
          break;
        }
        default: {
          Alert.alert(
            'Oops!',
            'Login failed!',
          );
        }
      }
    } catch (e) {
      Alert.alert(
        'Oops!',
        'Login failed!',
      );
    }
  };

  _goBack(){
    let {goBack} = this.props.navigation;

    goBack();

    // console.log(this.props);
  }

  render() {
    // const { navigate } = this.props.navigation;
    const { loginLoader } = this.state;

    return (
      <View style={styles.container}>
        <Button transparent
            style={{marginTop:20,position:'absolute',top:0, zIndex:2}}
            onPress={() => {
                this._goBack()
            }}>
            <Icon style={{ color: '#fff', fontSize: 36 }} name='ios-arrow-back' />
        </Button>
        
        <View style={styles.centerContainer}>
          <Text style={styles.highlightedText}>{"\n"}</Text>
          <Image source={require('../imgs/app-bg.png')} style={styles.backgroundImage} />
            <Image
                style={styles.logo}
                source={require('../imgs/Facelens-Logo.png')}
            />
          {/* <Text style={{color: 'white', backgroundColor: 'transparent', fontSize: 24}}>
            {"\n"}
            Face Lense
          </Text> */}
          {!loginLoader &&
            <Text style={styles.highlightedText}>
              Social Login
              {"\n\n"}
            </Text>
          }
          {!loginLoader &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.9 }}>
                <Button rounded block style={estyles.fbloginButton} onPress={this._handleFacebookLogin}>
                  <Icon name="logo-facebook" /><Text style={{ color: '#fff' }}>Login With Facebook</Text>
                </Button>
                <Text style={{ backgroundColor: 'transparent' }}>{"\n"}</Text>
                <Button rounded block style={estyles.gloginButton} onPress={this._handleGoogleLogin}>
                  <Icon name="logo-google" /><Text style={{ color: '#fff' }}> Login With Google</Text>
                </Button>
              </View>
            </View>
          }
          {loginLoader &&
            <Spinner color='white' style={{backgroundColor:'transparent'}} />
          }
        </View>
      </View>
    )

    // _thisNavigate = this.navigate;

  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#000',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    logo: {
      width: '80%',
      height:80
    },
    highlightedText: {
      color: "#fff",
      fontSize: 24,
      marginTop: 20,
      backgroundColor: 'transparent'
    },
    backgroundImage: {
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      resizeMode: 'stretch',
      width: '100%',
      height: '100%'
    }
  });
  let estyles = {
    inputField: {
      backgroundColor: 'rgba(255,255, 255, 1)'
    },
    inputIcon: {
      color: '#00C497'
    },
    fbloginButton: {
      opacity: 0.8,
      padding: 10,
      backgroundColor: '#5B63FF',
    },
    gloginButton: {
      opacity: 0.8,
      padding: 10,
      backgroundColor: '#10ac84'
    }
  }
