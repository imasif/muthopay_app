"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { Button, Spinner, Icon, Item, Input } from 'native-base';
import { Facebook,Google } from 'expo';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';


import { _navigateTo } from '../Helper';

import config from '../config';

const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class VerificationScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loginLoader: false
  }

  componentWillMount(){
    let {navigate} = this.props.navigation,
    {mobile} = this.props.navigation.state.params;

    // console.log('mobile', mobile);

    navigate('FaceScreen', {mobile});
  }

  _goBack(){
    let {goBack} = this.props.navigation;

    goBack();

    // console.log(this.props);
  }
  
  _handleSubmit(){
    let {navigate} = this.props.navigation;

    //*** this code is needed for moving to regiter face screen */
    navigate('FaceScreen', {mobile});
  }
  render() {
    // const { navigate } = this.props.navigation;
    const { loginLoader } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} 
      behavior="padding">
        <Button transparent
            style={{marginTop:20,position:'absolute',top:0, zIndex:2}}
            onPress={() => {
                this._goBack()
            }}>
            <Icon style={{ color: '#fff', fontSize: 36 }} name='ios-arrow-back' />
        </Button>
        
        <View style={styles.centerContainer}>
          <Text style={styles.highlightedText}>{"\n"}</Text>
          {/* <Image source={require('../imgs/app-bg.png')} style={styles.backgroundImage} /> */}
          <Image
            style={styles.logo}
            source={require('../imgs/Authenticator-Logo.png')}
          />
          {!loginLoader &&
            <Text style={styles.highlightedText}>
              Verify your mobile number
              {"\n\n"}
            </Text>
          }
          {!loginLoader &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.9 }}>
                <Item regular style={{ backgroundColor:'rgba(255,255,255,0.15)', borderColor:'transparent' }}>
                    <Input placeholderTextColor="rgba(255,255,255,0.8)" placeholder='Enter verification code' style={{paddingLeft:20, paddingRight:20, paddingTop:0, paddingBottom:0, color:'#fff'}}/>
                </Item>
                <Text style={{ backgroundColor: 'transparent' }}>{"\n"}</Text>
                <Button block style={estyles.submitButton} onPress={this._handleSubmit.bind(this)}>
                  <Text style={{ color: '#fff' }}> Submit</Text>
                </Button>
              </View>
            </View>
          }
          {loginLoader &&
            <Spinner color='white' style={{backgroundColor:'transparent'}} />
          }

          <Image style={styles.bottomCreditLogo}
            source={require('../imgs/Mononai-authenticator.png')}
          />

          <Text style={styles.creditFooter_first}>www.mononai.com{'\n'}</Text>
          <Text style={styles.creditFooter}>Copyright &copy; 2018 Mononai Limited All Rights Reserved</Text>
        </View>
      </KeyboardAvoidingView>
    )
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
      width: '52%',
      height: 150,
      resizeMode: 'contain'
    },
    bottomCreditLogo:{
      width:'50%', 
      height:100,
      marginTop: 50,
      resizeMode: 'contain'
    },
    creditFooter_first: {
      fontSize: 10,
      color: '#fff',
      marginTop: 70
    },
    creditFooter: {
      fontSize: 10,
      color: '#fff'
    },
    highlightedText: {
      color: "#fff",
      fontSize: 18,
      marginTop: 20,
      backgroundColor: 'transparent',
      fontStyle: 'normal',
      // fontFamily: 'Roboto'
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
    submitButton: {
      opacity: 0.8,
      padding: 10,
      backgroundColor: '#11BBC3'
    }
  }
