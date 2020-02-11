import React, { Component } from 'react';
import { Image, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Text, Icon, View, Grid, Row, Col, Content, Form, Item, Input, Tab, Tabs, TabHeading } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppHeader from '../header';
import {LinearGradient} from 'expo';


const welcomeGraphics = require("../../../assets/illustration-welcome.png");
export default class GetStartScreen extends Component {
  openDrawer = () => {
    this.props.navigation.openDrawer();
  }

  render() {
    // console.log('this.props.navigation',this.props.navigation);

    return (
      
      <Container>
        <AppHeader title={''} navigation={this.props.navigation}/>

        <Tabs tabContainerStyle={{elevation:0,borderBottomWidth:1,borderBottomColor:"#ccc"}} tabBarUnderlineStyle={{borderBottomWidth:2,borderBottomColor:"#3A9AFF"}}>
          <Tab heading={
              <TabHeading style={{ backgroundColor: "#fff", color: "#454545", elevation:0, shadowOpacity:0 }}>
                <Text style={{color: "#454545", fontSize: 14}}>Recharge</Text>
              </TabHeading>
            }>
            <KeyboardAvoidingView style={{ flex: 1, marginTop: 1, backgroundColor: '#eaeaea' }} behavior={Platform.OS == 'ios' ? '' : "padding"}>
              <LinearGradient
                colors={['#ffffff', '#EFEFEF', '#eaeaea']}
                style={{ flex: 1, paddingLeft: 15, paddingRight: 15, alignItems: 'center', borderRadius: 5 }}>
                <Content style={{ paddingLeft: 10, paddingRight: 10 }}>
                  <View style={{ width: '100%', textAlign: 'center', backgroundColor: 'transparent' }}>
                    <Image source={welcomeGraphics} style={{ width: '100%', height: 150 }} resizeMode={'contain'} />

                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                      Welcome to{' '}
                      <Text style={{ fontSize: 16, color: '#3D99FF' }}>
                        Muthopay
                    </Text>
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', marginRight: 55, textAlign: 'right' }}>Recharge</Text>
                  </View>


                  <Text style={{
                    fontSize: 13, textAlign: 'center', fontWeight: '300',
                    color: '#9E9E9E', paddingLeft: 10, paddingRight: 10, marginTop: 10, marginBottom: 10
                  }}>
                    You can recharge your phone balance with muthopay easy.
                    Enter your phone number to get started
                  </Text>

                  <Item regular style={{ borderWidth: 0, borderColor: 'transparent', marginBottom: 30 }}>
                    <Input style={{ backgroundColor: '#fff', color: '#eaeaea', fontSize: 14, borderRadius: 9 }}
                      placeholderTextColor={'#454545'}
                      placeholder='Phone number' />
                  </Item>

                  <TouchableOpacity onPress={() => console.log('get started')}>
                    <View style={{
                      backgroundColor: '#3D99FF', alignItems: 'center',
                      justifyContent: 'center', borderRadius: 9
                    }} >
                      <Text style={{ color: 'white', fontSize: 13, marginTop: 15, marginBottom: 15 }}>Get Started</Text>
                    </View>
                  </TouchableOpacity>

                </Content>
              </LinearGradient>
            </KeyboardAvoidingView>
          </Tab>
          <Tab heading={
              <TabHeading style={{ backgroundColor: "#fff", color: "#454545", shadowOpacity:0 }}>
                <Text style={{color: "#454545", fontSize: 14}}>Bus Ticket</Text>
              </TabHeading>
            }>
            <Text>Bus Ticket</Text>
          </Tab>
          <Tab heading={
              <TabHeading style={{ backgroundColor: "#fff", color: "#454545", shadowOpacity:0 }}>
                <Text style={{color: "#454545", fontSize: 14}}>Movie Ticket</Text>
              </TabHeading>
            }>
            <Text>Movie Ticket</Text>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}