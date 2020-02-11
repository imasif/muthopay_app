import React, { Component } from "react";
import { Image, Dimensions, Platform, Alert, AsyncStorage } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  View,
  Body,
  Left,
  Right,
  Badge
} from "native-base";

import { NavigationActions } from 'react-navigation';

import { _navigateTo } from './Helper';


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

// console.log('deviceHeight',deviceHeight);
// console.log('deviceWidth',deviceWidth);

const drawerCover = require("./imgs/drawer-cover.png");
const drawerImage = require("./imgs/drawer-cover.png");

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      workspace: [
        {
          value: 'MononAi',
        }, {
          value: 'bKash',
        }
      ]
    };
  }

  componentWillMount(){
    console.log('this.props.navigation.state.routes', this.props.navigation.state.routes);
  }


  render() {
    let {routes} = this.props.navigation.state;
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          {/* <List>
            <ListItem icon onPress={() => console.log('select workspace')}>
              <Body><Text>Item 1</Text></Body>
              <Right><Icon name="md-arrow-forward" /></Right>
            </ListItem>
          </List> */}
          <Image source={drawerCover} style={styles.drawerCover} />
          <Image square style={styles.drawerImage} source={drawerImage} />

          <List
            dataArray={routes}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => {
                  
                    // _navigateTo(data.routeName, this)

                    // this.props.navigation.dispatch(
                    //   NavigationActions.navigate({
                    //     routeName: 'DrawerScreens',
                    //     action: NavigationActions.navigate({ routeName: data.routeName }),
                    //   }),
                    // )

                    const navigateAction = NavigationActions.navigate({
                      routeName: 'DrawerScreens',
                      action: NavigationActions.navigate({
                        routeName: data.routeName,
                      }),
                    });
                    
                    return this.props.navigation.dispatch(navigateAction);
                  }
                }
                // onPress={() => console.log('data.routeName', data.routeName)}
              >
                {/* <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  /> 
                  <Text style={styles.text}> */}
                  <Text>
                    {data.routeName}
                  </Text>
                {/* </Left> */}
                {/* {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>} */}
              </ListItem>}
          />
          <List>
              <ListItem button noBorder onPress={()=>{
                Alert.alert(
                  'Warning',
                  'Sure you want to logout?',
                  [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'yes', onPress: async () => {
  
                      try {
                        await AsyncStorage.removeItem('data');
  
                        _navigateTo('RegularLogin', this);
                      } catch (error) {
                        console.log('error on clearing AsyncStorage', error);
                      }
  
                    }},
                  ],
                  { cancelable: false }
                )
              }}>
                <Text>Logout</Text>
              </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles =
{
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: '75%',
    height: 70,
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }
};

export default SideBar;