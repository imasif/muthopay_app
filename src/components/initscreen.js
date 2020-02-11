"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage } from 'react-native';
import { Button, Spinner, Icon } from 'native-base';
import { Facebook,Google } from 'expo';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';


import { _navigateTo } from './Helper';

import config from './config';

const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loginLoader: true,
    prevLogin: false
  }

  async componentWillMount(){
    let data = await AsyncStorage.getItem('data');

    console.log('data',data);
    if(data != null){
      // this.setState({prevLogin: true})
      setTimeout(()=>{
        _navigateTo('DrawerScreens', this);
      },2000)
    }else{
      setTimeout(()=>{
        _navigateTo('RegularLogin', this);
      },2000)
    }

  }

  _handleSocialLogin = () => {
      let {navigate} = this.props.navigation;

      navigate('SocialLogin');
  };

  _handleCredential = () => {
        let {navigate} = this.props.navigation;
            
        navigate('RegularLogin');
  };

  render() {
    // const { navigate } = this.props.navigation;
    const { loginLoader, prevLogin } = this.state;

    // if(!prevLogin){
      return (
        <View style={styles.container}>
          <View style={styles.centerContainer}>
            <Text style={styles.highlightedText}>{"\n"}</Text>
            {/* <Image source={require('./imgs/app-bg.png')} style={styles.backgroundImage} /> */}
              <Image
                  style={styles.logo}
                  source={require('./imgs/Authenticator-Logo.png')}
              />
            {/* <Text style={{color: 'white', backgroundColor: 'transparent', fontSize: 24}}>
              {"\n"}
              Face Lense
            </Text> */}
            {!loginLoader &&
              <Text style={styles.highlightedText}>
                Get Started
                {"\n\n"}
              </Text>
            }
            {!loginLoader &&
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.9 }}>
                  <Button rounded block style={estyles.socialLoginButton} onPress={this._handleSocialLogin}>
                    <Icon name="logo-facebook" /><Text style={{ color: '#fff' }}>/</Text><Icon name="logo-google" />
                    <Text style={{ color: '#fff' }}>Social Login</Text>
                  </Button>
                  <Text style={{ backgroundColor: 'transparent' }}>{"\n"}</Text>
                  <Button rounded block style={estyles.credentialLoginButton} onPress={this._handleCredential}>
                    <Icon name="md-phone-portrait" /><Text style={{ color: '#fff' }}>/</Text><Icon name="ios-mail" />
                    <Text style={{ color: '#fff' }}>Login With credentials</Text>
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
    // }else{
    //   return(
    //     <View style={{
    //       flex: 1,
    //       width: '100%',
    //       backgroundColor:'#fff'}}>
    //       <Text>Hi</Text>
    //     </View>
    //   )
    // }
    

    // _thisNavigate = this.navigate;

  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#1a1a1a',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    logo: {
      width: 200,
      height: 160,
      resizeMode: 'contain'
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
    socialLoginButton: {
      opacity: 0.8,
      padding: 10,
      backgroundColor: '#54a0ff',
    },
    credentialLoginButton: {
      opacity: 0.8,
      padding: 10,
      backgroundColor: '#10ac84'
    }
  }
