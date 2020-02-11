"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { Button, Spinner, Icon, Item, Input, ListItem, Left, Right, Radio } from 'native-base';
import validator from 'validator';
// import Toast from 'react-native-simple-toast';

import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';
import {_navigateToWithParam} from '../Helper';


import { _navigateTo } from '../Helper';

import config from '../config';

const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class InfoScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loginLoader: false,
    name: '',
    isName: undefined,
    email: '',
    isEmail: undefined,
    //*** Get mobile number from previous screen */
    // mobile: this.props.navigation.state.params.mobile,
    gender: 'male'
  }


  componentWillMount(){
    let {navigate} = this.props.navigation,
    {data} = this.props.navigation.state.params;

    console.log('infoscreen data',data);
  }

  _goBack(){
    let {goBack} = this.props.navigation;

    goBack();
  }

  nameInputChange = (name)=> {
    let isName = name.length > 2;

    if(isName){
      this.setState({isName});
    }
    
    this.setState({name});
}
  emailInputChange = (email)=> {
      let isEmail = validator.isEmail(email);

      if(isEmail){
        this.setState({isEmail});
      }
      
      this.setState({email});
  }

  _handleSubmit = async()=> {
      let {navigate} = this.props.navigation;
      let {name,email,gender} = this.state,
      {data,phone} = this.props.navigation.state.params,
      isName = name !== '',
      isEmail = validator.isEmail(email);

      if(!isName){
        // Toast.show('Name is empty.');
        this.setState({isName:false});
        return;
      }

      if(!isEmail){
          // Toast.show('Invalid email address.');
          this.setState({isEmail:false});
          return;
      }
      

      data.append('data', JSON.stringify({
        'name':name,
        'time': Date.now(),
        'email':email,
        'phone': phone,
        'gender':gender
      })); // you can append anyone.

      console.log('data in info.js', data);
  
      let currentWorkspace = await AsyncStorage.getItem('workspace');
      if(currentWorkspace !== null) currentWorkspace = JSON.parse(currentWorkspace);

      // this.setState({name,isName,gender,email,isEmail});

      fetch(`http://${currentWorkspace.server_ip}:5004/api/enroll/user_multi_image`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*, multipart/form-data',
            'Content-Type': 'multipart/form-data',
            'cache-control': 'no-cache'
        },
        body: data
        }).then(res => res.json())
        .then(res=>{
            let User_Status = res["User_Status"];
            let Registration_Status = res["Registration_Status"];
            console.log('test',res);
            if(Registration_Status === "Email already exists" && User_Status == "Approved"){
              _navigateToWithParam(this, 'DrawerScreens', {data, User_Status})
            }
            if(User_Status === "Under Review"){
              _navigateToWithParam(this, 'UnderReviewScreen', {data, User_Status})
            }
        });


      // navigate('QrScanScreen',{profile: {name,email,gender,mobile}});
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
              Enter information
              {"\n\n"}
            </Text>
          }
          {!loginLoader &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.9 }}>
                <Item regular style={{ backgroundColor:'rgba(255,255,255,0.15)', borderColor:'transparent' }}  success={this.state.isName} error={this.state.isName == false}>
                    <Input placeholderTextColor="rgba(255,255,255,0.8)" placeholder='Full name' style={{paddingLeft:20, paddingRight:20, paddingTop:0, paddingBottom:0, color:'#fff'}}
                      onChangeText={this.nameInputChange}
                    />

                    {this.state.isName && <Icon name='checkmark-circle' style={{ color: '#2B8339' }} />}
                    {this.state.isName == false && <Icon name='close-circle' style={{ color: '#ff0000' }} />}
                </Item>
                <Text>{'/n'}</Text>
                <Item regular style={{ backgroundColor:'rgba(255,255,255,0.15)', borderColor:'transparent' }} success={this.state.isEmail} error={this.state.isEmail == false}>
                    <Input placeholderTextColor="rgba(255,255,255,0.8)" placeholder='Enter your email'
                    keyboardType='email-address' returnKeyType='next'
                    autoCapitalize='none' onChangeText={this.emailInputChange}
                    style={{paddingLeft:20, paddingRight:20, paddingTop:0, paddingBottom:0, color:'#fff'}}/>

                    {this.state.isEmail && <Icon name='checkmark-circle' style={{ color: '#2B8339' }} />}
                    {this.state.isEmail == false && <Icon name='close-circle' style={{ color: '#ff0000' }} />}
                </Item>
                <Text>{'/n'}</Text>
                <ListItem style={{borderBottomWidth: 0}} selected={true} >
                  <Radio
                    color={"#f0ad4e"}
                    selectedColor={"#5cb85c"}
                    selected={(this.state.gender == 'male') ? true: false}
                    onPress={()=> this.setState({gender: 'male'})}
                  />
                  <Text style={{color:'#fff'}}
                    onPress={()=> this.setState({gender: 'male'})}> {'   '} Male {'   '} </Text>
                  <Radio
                    color={"#f0ad4e"}
                    selectedColor={"#5cb85c"}
                    selected={(this.state.gender == 'female') ? true: false}
                    onPress={()=> this.setState({gender: 'female'})}
                  />
                  <Text style={{color:'#fff'}}
                    onPress={()=> this.setState({gender: 'female'})}> {'   '} Female {'   '} </Text>
                  <Radio
                    color={"#f0ad4e"}
                    selectedColor={"#5cb85c"}
                    selected={(this.state.gender == 'others') ? true: false}
                    onPress={()=> this.setState({gender: 'others'})}
                  />
                  <Text style={{color:'#fff'}}
                    onPress={()=> this.setState({gender: 'others'})}> {'   '} Others {'   '} </Text>
                </ListItem>
                <Text style={{ backgroundColor: 'transparent' }}>{"\n"}</Text>
                <Button block style={[estyles.submitButton, {backgroundColor: '#11BBC3'}]} onPress={this._handleSubmit.bind(this)}>
                  <Text style={{ color: '#fff' }}>Next</Text>
                </Button>
              </View>
            </View>
          }
          {loginLoader &&
            <Spinner color='white' style={{backgroundColor:'transparent'}} />
          }

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
        backgroundColor: '#10ac84'
    }
}
