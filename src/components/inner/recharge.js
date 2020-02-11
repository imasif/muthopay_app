import React, { Component } from 'react';
import { Image, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Dimensions, FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Header, Left, Body, Right, Title,
   Text, Icon, View, Grid, Row, Col, Content, Form, Item, Input } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppHeader from '../header';
import {LinearGradient} from 'expo';
import ModalDropdown from 'react-native-modal-dropdown';


const welcomeGraphics = require("../../../assets/illustration-welcome.png");
export default class RechargeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      amount: '',
      selected_offer: '',
      operatorSelect: {
        'icon': require('../../../assets/icon-teletalk.png'),
        'name':'teletalk'
      },
      offer_data: [
        {
          'amount': 59,
          'offer': '20mb internet, 20minutes talktime',
        },
        {
          'amount': 29,
          'offer': '10mb internet, 10minutes talktime',
        },
        {
          'amount': 69,
          'offer': '30mb internet, 30minutes talktime',
        },
        {
          'amount': 79,
          'offer': '40mb internet, 40minutes talktime',
        },
        {
          'amount': 19,
          'offer': '5mb internet, 10minutes talktime',
        },
        {
          'amount': 99,
          'offer': '100mb internet, 100minutes talktime',
        },
      ]
    }
  }
  
  openDrawer = () => {
    this.props.navigation.openDrawer();
  }

  operator_options = [
    {
      "icon": require('../../../assets/icon-teletalk.png')
    },
    {
      "icon": require('../../../assets/icon-airtel.png')
    },
    {
      "icon": require('../../../assets/icon-banglalink.png')
    },
    {
      "icon": require('../../../assets/icon-grameenphone.png')
    },
    {
      "icon": require('../../../assets/icon-robi.png')
    },
  ];

  operator_renderRow(rowData, rowID, highlighted) {
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={styles.operator_row}>
          <Image style={styles.operator_row_image} mode='stretch' source={rowData.icon}/>
        </View>
      </TouchableHighlight>
    );
  }
  operator_onSelect(idx, value) {
    this.setState({operatorSelect:value})
  }
  amountOnChange(val){
    this.setState({amount:val, selected_offer:''})
  }
  selectOffer(idx,amount){
    // console.log(idx);
    this.setState({selected_offer:idx,amount:amount.toString()});
  }

  render() {
    let {selected_offer} = this.state;
    // console.log('this.props.navigation',this.props.navigation);

    return (
      
      <Container>
        <AppHeader title={'Recharge details'} navigation={this.props.navigation}/>

        <KeyboardAvoidingView style={{flex:1, marginTop:1, backgroundColor:'#eaeaea'}} behavior={Platform.OS == 'ios'? '' : "padding"}>
          <LinearGradient
          colors={['#f9f9fb', '#f9f9fb', '#f8f8fa']}
          style={{flex:1, paddingTop:20, alignItems: 'center'}}>
            <Content>
              <Item regular style={{backgroundColor:'#fff', borderWidth:0, borderRadius:10, paddingLeft:10, paddingRight:10, marginLeft:15,
              width: Platform.OS == 'ios' ? Dimensions.get('window').width-65 : Dimensions.get('window').width-30, borderColor:'transparent', marginBottom:30}}>
                <Text style={{width: (Dimensions.get('window').width/3)-10, fontSize:13}}>Phone Number</Text>
                <Input placeholderTextColor={"#ccc"} placeholder={"01xxxxxxxxx"} style={{color:'#454545', fontSize:14, borderRadius:10}}/>

                <ModalDropdown
                defaultValue={'operator'}
                showsVerticalScrollIndicator={true}
                renderRow={this.operator_renderRow.bind(this)}
                dropdownStyle={{marginTop:-30, height:100}}
                onSelect={(idx, value) => this.operator_onSelect(idx, value)}
                options={this.operator_options}>
                  <Image style={styles.operator_image} source={this.state.operatorSelect.icon}/>
                </ModalDropdown>
              </Item>
                              
              <Item regular style={{backgroundColor:'#fff', borderWidth:0, borderRadius:10, paddingLeft:10, paddingRight:10, marginLeft:15,
              width: Platform.OS == 'ios' ? Dimensions.get('window').width-65 : Dimensions.get('window').width-30, borderColor:'transparent', marginBottom:30}}>
                <Text style={{width: (Dimensions.get('window').width/3)-10, fontSize:13}}>Amount</Text>
                <Input value={this.state.amount} onChangeText={this.amountOnChange.bind(this)} placeholderTextColor={"#ccc"} placeholder={"recharge amount"} style={{backgroundColor:'#fff', color:'#454545', fontSize:14, borderRadius:10}}/>
              </Item>

              <FlatList style={{marginBottom:10,}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.offer_data}
                  // extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index})=>
                    <TouchableOpacity onPress={this.selectOffer.bind(this,index,item.amount)} style={{ width:100, height:100, marginRight:10, padding:5}}>
                      <Text style={{fontSize:14, color:'#fff', paddingLeft:10, paddingTop:5, backgroundColor: index === selected_offer ? '#ff8a80':'#4E8FF3',
                      borderTopLeftRadius:9, borderTopRightRadius:9}}>৳{item.amount}</Text>
                      <Text style={{fontSize:10, padding:5, color:'#fff', backgroundColor: index === selected_offer ? '#ffbcaf' :'#8db9fc',
                      borderBottomLeftRadius:9, borderBottomRightRadius:9}}>{item.offer}</Text>
                    </TouchableOpacity>
                  }
              />
              
              <TouchableOpacity onPress = {() => console.log('get started')}>
                  <View style = {{width: Platform.OS == 'ios' ? Dimensions.get('window').width-65 : Dimensions.get('window').width-30, backgroundColor: '#3D99FF', alignItems: 'center', 
                                  justifyContent: 'center', borderRadius: 9, marginLeft:15}}>
                      <Text style = {{color: 'white', fontSize:13, marginTop:15, marginBottom:15}}>Next</Text>
                  </View>
              </TouchableOpacity>
            </Content>
          </LinearGradient>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  operator_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  operator_row_image: {
    marginLeft: 4,
    marginRight: 4,
    width: 30,
    height: 30,
  },
  operator_image: {
    width: 30,
    height: 30,
  },
});