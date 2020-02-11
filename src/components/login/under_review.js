"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage } from 'react-native';
import { Button, Spinner, Icon } from 'native-base';
import { Facebook,Google } from 'expo';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';

const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class UnderReviewScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
  }

  async componentWillMount(){
    // let {data, User_Status} = this.props.navigation.state.params;

    // await AsyncStorage.setItem('data', JSON.stringify(data));

    // await AsyncStorage.setItem('User_Status', JSON.stringify(User_Status));

    // console.log('data in componentWillMount qrscreen',data);
    // console.log('User_Status in componentWillMount qrscreen',User_Status);
    
    let $this = this;

    function delay(time) {
        setTimeout(() => {
            let {navigate} = $this.props.navigation;

            // console.log('$this.props.navigation',$this.props.navigation);

            navigate('RegularLogin');
        }, time);
    }

    // delay(14000);
  }

  render() {
    // const { navigate } = this.props.navigation;
    // const { loginLoader } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.highlightedText}>{"\n"}</Text>
          {/* <Image source={require('./imgs/app-bg.png')} style={styles.backgroundImage} /> */}
            <Image
                style={styles.logo}
                source={require('../imgs/Authenticator-Logo.png')}
            />
          {/* <Text style={{color: 'white', backgroundColor: 'transparent', fontSize: 24}}>
            {"\n"}
            Face Lense
          </Text> */}
          
            <Text style={[styles.highlightedText, {color: '#11BBC3'}]}>
              Under Review
              {"\n\n"}
            </Text>

            <Text style={{color:'#fff', fontSize:14, textAlign:'center', maxWidth:320}}>
            Your account is now <Text style={{fontWeight: "bold"}}>under review</Text>. Please wait, while an administrator approves your enrollment. {'\n\n'}
            Your account will be activated once an administrator reviews and approves your enrollment.
            </Text>

            <Button block onPress={()=>this.props.navigation.navigate('RegularLogin')} style={{width:200, alignSelf:'center', marginTop:50, backgroundColor:'#11BBC3'}}>
              <Text style={{color:'#fff'}}>Back to login</Text>
            </Button>

            {/* <Spinner color='white' style={{backgroundColor:'transparent'}} /> */}


          <Image style={styles.bottomCreditLogo}
            source={require('../imgs/Mononai-authenticator.png')}
          />

          <Text style={styles.creditFooter_first}>www.mononai.com{'\n'}</Text>
          <Text style={styles.creditFooter}>Copyright &copy; 2018 Mononai Limited All Rights Reserved</Text>
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
      marginTop: 20
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
