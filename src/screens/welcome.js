//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,YellowBox, TouchableWithoutFeedback, AsyncStorage } from 'react-native';

// create a component
class welcome extends Component {
    render() {
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
        YellowBox.ignoreWarnings(['Warning: ']);
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => { AsyncStorage.setItem('Type', 'W'), this.props.navigation.navigate("HomeScreen") }}>
                    <View style={{ width: '80%', height: 50, borderRadius: 10, backgroundColor: '#cececd', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>Writer</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { AsyncStorage.setItem('Type', 'A'), this.props.navigation.navigate("HomeScreen") }}>
                    <View style={{ width: '80%', marginTop: 20, height: 50, borderRadius: 10, backgroundColor: '#cececd', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>Admin</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

//make this component available to the app
export default welcome;
