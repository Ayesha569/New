import React, { memo } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
//import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
//import Button from "../components/Button";
import { logoutUser } from "../api/auth-api";

import { StatusBar, Text, AsyncStorage,YellowBox } from 'react-native';
import SideBar from './sidebar'
import Assignments from './Tabs/assignments';
import Requests from './Tabs/request';
import Quework from './Tabs/quework';

import UAssignments from './UserTabs/assignments';
import URequests from './UserTabs/request';
import UQuework from './UserTabs/quework';
import { Container, Header, Drawer, Left, Body, Right, Button, Icon, Tabs, Tab, Title, Content } from 'native-base';
export default class Dashboard extends React.Component {
  state = {
    value: ''
  }
  componentDidMount = async () => {
    const value = await AsyncStorage.getItem('Type');
    //alert(value)
    this.setState({ value: value })
  }
  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open();
  };
  render() {
    console.disableYellowBox=true
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
    YellowBox.ignoreWarnings(['Warning: ']);
    return (
      <Drawer
        openDrawerOffset={0.1}
        ref={(ref) => { this.drawer = ref; }} content={<SideBar />} onClose={() => this.closeDrawer()} >
        <Container >
          <StatusBar backgroundColor='#ffffff' />
          <Header hasTabs style={{ backgroundColor: '#ffffff', marginTop: 20, borderBottomWidth: 0, marginBottom: 0 }}>
            <Left>
              <Button onPress={() => this.openDrawer()} transparent>
                <Icon style={{ color: 'black' }} name='menu' />
              </Button>
            </Left>
            <Body>
              <Text>APC</Text>
            </Body>
            <Right>
              <Button transparent>
                <Icon style={{ color: 'black' }} name='search' />
              </Button>
              <Button transparent>
                <Icon style={{ color: 'black' }} name='more' />
              </Button>

            </Right>
          </Header>
          {
            this.state.value == 'A' ?
              <Tabs tabBarUnderlineStyle={{ backgroundColor: 'red' }}>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="ASSIGNMENTS">
                  <Assignments />
                </Tab>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="REQUESTS">
                  <Requests />
                </Tab>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="WORK IN QUE">
                  <Quework />
                </Tab>
              </Tabs>
              :
              <Tabs tabBarUnderlineStyle={{ backgroundColor: 'red' }}>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="ASSIGNMENTS">
                  <UAssignments />
                </Tab>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="WORK IN QUE">
                  <UQuework />
                </Tab>
                <Tab tabStyle={{ backgroundColor: '#ffffff' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: '#ffffff' }} activeTextStyle={{ color: 'red' }} heading="UPLOAD WORK">
                  <URequests />
                </Tab>

              </Tabs>
          }

        </Container>
      </Drawer>
    )
  }
}
{/* <Button mode="outlined" onPress={() => logoutUser()}>
      Logout
    </Button> */}

