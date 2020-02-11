import React, { Component } from 'react';
import {StatusBar,} from 'react-native';
import { Container,  Header, Left, Body, Right, Title, Button, Text, Icon, View, Grid, Col, Row } from 'native-base';
import { Constants } from 'expo';

export default class AppHeader extends Component {
  openDrawer = () => {
    this.props.navigation.openDrawer();
  }

  render() {
    // console.log('this.props.navigation',this.props.navigation);

    return (
        <View>
          <View key={'statusbar'} style={{backgroundColor: "#3D99FF", height: Constants.statusBarHeight}} />
          <Header key={'mainHeader'} iosBarStyle={"light-content"} androidStatusBarColor='#000'
          style={{height:'auto', borderBottomWidth:0, backgroundColor:'#fff', elevation:0, shadowOpacity:0}}>
            {/* <StatusBar backgroundColor="#c0c0c0" barStyle="light-content" translucent={false}/> */}
            <Left style={{flex:1}}>
              <Text style={{color:'#3D99FF', fontSize:16, marginLeft:5, marginTop:20}}>Muthopay</Text>
              <Text style={[{width:200, fontSize:24, fontWeight:'400', marginTop:5, marginBottom:15}, this.props.title == '' && {display:'none'}]}>{this.props.title}</Text>
            </Left>
            <Body>
            </Body>
            <Right>
              <Button transparent onPress={()=>this.openDrawer()}>
                <Icon ios='ios-menu' android="md-menu" style={{fontSize: 20, color: 'black'}}/>
              </Button>
            </Right>
          </Header>
        </View>
    );
  }
}