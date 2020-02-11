"use strict";

import React from 'react';
import { StyleSheet, Text, View, Image, Alert, AsyncStorage, KeyboardAvoidingView, NetInfo, Picker, Dimensions } from 'react-native';
import { Button, Spinner, Icon, Item, Input, Toast } from 'native-base';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';
import validator from 'validator';

import {totalWidth} from '../Helper';

import ModalDropdown from 'react-native-modal-dropdown';

// import Toast from 'react-native-simple-toast';
import { _navigateToWithParam } from '../Helper';
import { _navigateTo } from '../Helper';

import config from '../config';

const headers = {
  'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
};

export default class RegularLoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loginLoader: false,
    mobile: '',
    isMobile: undefined,
    mainWorkspace: {},
    workspace: [],
    currentWorkspace: ''
  }

  async componentDidMount(){
// Generate headerRight dropdown for getting ip addr
    await fetch('https://face-lens-auth.firebaseio.com/org.json',{})
    .then(res=> res.json())
    .then(res=>{
      let {workspace} = this.state;

      console.log('res',res);

      Object.keys(res).map((item,index)=>{
        workspace.push(res[item]);
      });
      // console.log('res workspace',workspace);
      this.setState({workspace, mainWorkspace:res});
    });

    this.loadWorkspaceFromAsyncStorage();
  }

  loadWorkspaceFromAsyncStorage = async() => {
    // await AsyncStorage.removeItem('workspace');
    let {mainWorkspace,currentWorkspace} = this.state;
    currentWorkspace = await AsyncStorage.getItem('workspace');
    if(currentWorkspace !== null){
      currentWorkspace = JSON.parse(currentWorkspace);
    } else{
      currentWorkspace = mainWorkspace['monon_dev'];
    }

    this.setState({currentWorkspace});
    // console.log('this.state.currentWorkspace',this.state.currentWorkspace);
  }


  _goBack() {
    let { goBack } = this.props.navigation;

    goBack();
  }

  mobileInputChange(mobile) {
    let isMobile = validator.isMobilePhone(mobile, ['bn-BD']);

    if (isMobile) {
      this.setState({ isMobile });
    }

    this.setState({ mobile });
  }

  dropdown_renderButtonText = (rowData) => {
    const { org_name } = rowData;
    return `${org_name}`;
  }
  
  dropdown_renderRow = (rowData, rowID, highlighted) => {
    // let evenRow = rowID % 2;

    console.log('rowData',rowData);
    return (
      <View style={{margin:10}}>
        <Text>
          {rowData.org_name}
        </Text>
      </View>
    );
  };

  dropdown_rowselect = async (idx, val) => {
    console.log(idx, val);
    // return val.org_name;

    await AsyncStorage.setItem('workspace', JSON.stringify(val));
    this.setState({currentWorkspace:val});
  }

  async _handleSubmit() {
    let { navigate } = this.props.navigation,
      { mobile, currentWorkspace } = this.state,
      isMobile = validator.isMobilePhone(mobile, ['bn-BD']);

    if (!isMobile) {
      // Toast.show('Invalid mobile number.');
      this.setState({ isMobile: false });
      return;
    }

    let sendData = {
      "Google_Auth_Token": null,
      "FB_Auth_Token": null,
      "Email": null,
      "Phone": "+88" + mobile
    }

    console.log('JSON.stringify(sendData)', JSON.stringify(sendData));

    let workspace = await AsyncStorage.getItem('workspace');

    console.log('workspace',workspace);
    
    console.log('currentWorkspace from handle_submit', currentWorkspace);

    fetch(`http://${currentWorkspace.server_ip}:5101/api/mobile_auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(sendData)
    })
    .then(res => res.json())
    .then(async res => {
      // console.log('test',res);
      let User_Status = res["User_Status"];
      console.log('res in regular.js', res);


      if (User_Status == "New") {
        // navigate('Verification', { mobile });
        //*** Will change it to Verification which is needed */
        navigate('FaceScreen', {mobile});
      }

      if (User_Status == "Under Review") {
        _navigateTo('UnderReviewScreen', this);
      }

      if (User_Status == "Approved") {
        // console.log('approved user', res);
        await AsyncStorage.setItem('data', JSON.stringify(res));
        await AsyncStorage.setItem('User_Status', JSON.stringify(User_Status));
        _navigateTo('DrawerScreens', this);
      }
    })
    .catch(err => {
      console.log('err',err);

      if (err == "TypeError: Network request failed") {
        console.log('network req failed');
        // Toast.show('Server not found.');

        NetInfo.getConnectionInfo().then((connectionInfo) => {
          console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
        });
        function handleFirstConnectivityChange(connectionInfo) {
          console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
          NetInfo.removeEventListener(
            'connectionChange',
            handleFirstConnectivityChange
          );
        }
        NetInfo.addEventListener(
          'connectionChange',
          handleFirstConnectivityChange
        );
      }
    });

    // await AsyncStorage.setItem('profile', AccessToken);
  }

  render() {
    // const { navigate } = this.props.navigation;
    const { loginLoader } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}
        behavior="padding">
        {/* <Button transparent
            style={{marginTop:20,position:'absolute',top:0, zIndex:2}}
            onPress={() => {
                this._goBack()
            }}>
            <Icon style={{ color: '#fff', fontSize: 36 }} name='ios-arrow-back' />
        </Button> */}

        <View style={styles.centerContainer}>
          <Text style={styles.highlightedText}>{"\n"}</Text>
          {/* <Image source={require('../imgs/app-bg.png')} style={styles.backgroundImage} /> */}
          <Image
            style={styles.logo}
            source={require('../imgs/Authenticator-Logo.png')}
          />
          {!loginLoader &&
            <Text style={styles.highlightedText}>
              Login to your account
              {"\n\n"}
            </Text>
          }
          {!loginLoader &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.9 }}>
                <Item regular style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderColor:'transparent' }} success={this.state.isMobile} error={this.state.isMobile == false}>
                  
                  <Input placeholderTextColor="rgba(255,255,255,0.8)"
                    keyboardType='numeric'
                    onChangeText={this.mobileInputChange.bind(this)}
                    placeholder='Enter your mobile number'
                    style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 0, paddingBottom: 0, color: '#fff' }} />

                  {this.state.isMobile && <Icon name='checkmark-circle' style={{ color: '#2B8339' }} />}
                  {this.state.isMobile == false && <Icon name='close-circle' style={{ color: '#ff0000' }} />}
                </Item>
                <Text style={{ backgroundColor: 'transparent' }}>{"\n"}</Text>
                <Button  block style={estyles.submitButton} onPress={this._handleSubmit.bind(this)}>
                  <Text style={{ color: '#fff' }}>Login/Enroll</Text>
                </Button>
                <Text>{'\n'}</Text>
                <ModalDropdown style={{ width: totalWidth, height:50, backgroundColor:'#fff',
                    borderColor:"#fff", borderLeftWidth:null, borderRadius:2, borderRightWidth:null,
                    borderTopWidth:null,elevation:2}}
                    textStyle={{fontSize:14, marginTop:14, color:'#11BBC3', alignSelf:'center'}}
                    dropdownStyle={{width:'90%'}}
                    dropdownTextStyle={{fontSize:18}}
                    
                    defaultValue={this.state.currentWorkspace['org_name']}
                    renderButtonText={(rowData) => this.dropdown_renderButtonText(rowData)}
                    onSelect={this.dropdown_rowselect}
                    renderRow={this.dropdown_renderRow}
                    options={this.state.workspace}/>
              </View>
            </View>
          }
          {loginLoader &&
            <Spinner color='white' style={{ backgroundColor: 'transparent' }} />
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
