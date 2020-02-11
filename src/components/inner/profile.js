import React, { Component } from "react";
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet,
  TouchableOpacity, TouchableHighlight, Image, AsyncStorage, Platform, Button } from 'react-native';

export default class ProfileScreen extends Component {

  // static navigationOptions = {
  //   // headerTitle instead of title
  //   headerTitle: '<LogoTitle />',
  //   headerRight: (
  //     <Button
  //       onPress={() => alert('This is a button!')}
  //       title="Info"
  //       color="#fff"
  //     />
  //   ),
  // };

  render() {
    return (
      <View style={{ backgroundColor: "#FFF" }}>

        {/* <StatusBar hidden /> */}

        <Text style={{fontSize:36}}>Profile</Text>
      </View>
    );
  }
}

