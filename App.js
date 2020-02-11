import {Font} from "expo";

import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing, Text, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";

import { StyleProvider, Button, Icon, TouchableHighlight } from 'native-base';

import ModalDropdown from 'react-native-modal-dropdown';

import InitScreen from './src/components/initscreen';
import SocialLoginScreen from './src/components/login/social';
import RegularLoginScreen from './src/components/login/regular';
import VerificationScreen from './src/components/login/verification';
import FaceScreen from './src/components/login/face';
import InfoScreen from './src/components/login/info';
import UnderReviewScreen from './src/components/login/under_review';

import GetStartScreen from './src/components/inner/getStart';
import RechargeScreen from './src/components/inner/recharge';
import NotificationScreen from './src/components/inner/notification';
import ProfileScreen from './src/components/inner/profile';
import SettingScreen from './src/components/inner/setting';

import SideBar from './src/components/sidebar';
import { Platform } from 'react-native';

import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';


class App extends Component {
  constructor() {
    super();
    this.state = {
      font_loaded: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("./node_modules/@expo/vector-icons/fonts/Ionicons.ttf"),
    });

    this.setState({font_loaded:true});
    // console.log('Font',Font)
  }


  render() {
    let {font_loaded} = this.state,
    showElement = font_loaded ? <createAppContainer />
    :
    <View><Text>font not loaded</Text></View>;
    return (
      {showElement}
    );
  }
}


const DrawerScreens = createDrawerNavigator(
  {
    GetStart: {
      screen: GetStartScreen,
    },
    Recharge: {
      screen: RechargeScreen,
      navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })
    },
    // Notifications: {
    //   screen: NotificationScreen,
    // },
    // Profile:{
    //   screen: ProfileScreen,
    // },
    // Settings:{
    //   screen: SettingScreen,
    // }
  },
  {
  initialRouteName: 'GetStart',
  drawerPosition: 'right',
  drawerOpenRoute: 'DrawerRightOpen',
  navigationOptions: {
    // headerTitle instead of title
    header: null
    // headerTitle: 'Face Lens',
    // headerStyle: {
    //   backgroundColor: '#1a1a1a',
    // },
    // headerTintColor: '#fff',
    // drawerLockMode: 'locked-closed',
    
    // headerLeft:( nav ) => {
    //   // Needed to using params for stack nav inside of drawer nav
    //   // Here unable to get this says undefined
    //   // console.log('nav', nav);
    //   // console.log('this.props.navigation', QrScanScreen.props)
    //   return  <Button style={{height:'100%', backgroundColor:'transparent', elevation:0}}
    //             onPress={()=>nav.scene.descriptor.navigation.openDrawer()} >
    //             <Icon ios='ios-menu' android="md-menu" style={{fontSize: 36, color: '#fff'}}/>
    //           </Button>
    // }
  },
  contentComponent: props => <SideBar {...props} />
  }
);

// Generate headerRight dropdown for getting ip addr
// fetch('https://face-lens-auth.firebaseio.com/org.json',{})
// .then(res=> res.json())
// .then(res=>{
//   console.log('res',res);
//   let options = [],
//   defaultOption = 'Monon AI';

//   Object.keys(res).map((item,index)=>{
//     options.push(res[item]);
//   });
//   console.log('res options',options);

//   let dropdownText = 'Monon AI';


//   // workspace selector
//   //Dropdown row actions
//   dropdown_renderRow = (rowData, rowID, highlighted) => {
//     // let evenRow = rowID % 2;

//     // console.log('rowData',rowData);
//     return (
//       <View style={{margin:10}}>
//         <Text>
//           {rowData.org_name}
//         </Text>
//       </View>
//     );
//   };

//   dropdown_rowselect = async (idx, val) => {
//     console.log(idx, val);
//     // return val.org_name;
//     defaultOption = val.org_name;

//     await AsyncStorage.setItem('workspace', JSON.stringify(val));
//     let workspace = await AsyncStorage.getItem('workspace');

//     console.log('workspace in app',workspace);
//     return defaultOption;
//   }

//   dropdown_renderButtonText = (rowData) => {
//     const { org_name } = rowData;
//     return `${org_name}`;
//   }
  
//   DrawerScreens.navigationOptions.headerRight = (<ModalDropdown style={{ width: 150, height:'60%' }}
//                                                 textStyle={{fontSize:18, color:'#fff', alignSelf:'center'}}
//                                                 dropdownTextStyle={{fontSize:18}}
//                                                 defaultValue={defaultOption}
//                                                 onSelect={dropdown_rowselect}
//                                                 renderButtonText={(rowData) => dropdown_renderButtonText(rowData)}
//                                                 renderRow={dropdown_renderRow}
//                                                 options={options}/>);
// });


const AppNavigator = createStackNavigator(
  {
    InitScreen: {
      screen: InitScreen
    },
    SocialLogin: {
      screen: SocialLoginScreen
    },
    RegularLogin: {
      screen: RegularLoginScreen
    },
    Verification: {
      screen: VerificationScreen
    },
    InfoScreen: {
      screen: InfoScreen
    },
    FaceScreen: {
      screen: FaceScreen,
      navigationOptions: {
        // headerTitle instead of title
        headerTitle: 'Face Lens',
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff'
      }
    },
    UnderReviewScreen: {
      screen: UnderReviewScreen
    },
    DrawerScreens: {
      screen: DrawerScreens,
    },
  },
  {
    initialRouteName: 'DrawerScreens',
    mode: Platform.OS == 'ios' ? 'model' : 'card',
    // headerMode: 'screen',
    transitionConfig : () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    })
  },
);

const customTextProps = {
  style: {
    fontSize: 16,
    // fontFamily: 'Roboto',
    color: 'black'
  }
};

// setCustomText(customTextProps);

export default createAppContainer(AppNavigator);