//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { logoutUser } from '../api/auth-api'
// create a component
class SideBar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => logoutUser()}>
                    <View style={{ width: '100%', height: 50, backgroundColor: '#B1B9B9', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                        <Text style={{ color: 'white' }} >Sign out</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default SideBar;
