//import liraries
import React, { memo, Component } from 'react';
import { View, Text, TextInput, DatePickerAndroid, Alert, Linking, ScrollView, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import Modal from "react-native-modal";
import { Textarea, Button, Icon } from 'native-base';
import * as DocumentPicker from 'expo-document-picker';
import * as firebase from 'firebase';
import { logoutUser } from '../../api/auth-api'
// create a component
class Assignments extends Component {
    constructor(props) {
        super(props);

    }
    state = {
        searchtext: '',
        Assignmentslist: [],
        Assignmentlist: [{ title: 'Title 1', name: 'Description ' }, { title: 'Title 2', name: 'i want to need this task asap' }, { title: 'Title 3', name: 'this is a simple paragraph that is meant to be nice and easy to type which is why there will be mommas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph' }],
        SearchList: [],
        isModalVisible2: false,
        AssignmentDetail: {
            title: '',
            Date: '',
            charges: '',
            Description: '',
            filelist: []
        }

    };

    componentDidMount() {
        this.GetAssignments()
    }

    toggleModal2 = (data) => {
        let temp = this.state.AssignmentDetail
        temp.title = this.state.Assignmentslist[data].title;
        temp.Description = this.state.Assignmentslist[data].Description;
        temp.Date = this.state.Assignmentslist[data].duedate;
        temp.charges = this.state.Assignmentslist[data].Charges;
        temp.filelist = this.state.Assignmentslist[data].fileuri;
        this.setState({ isModalVisible2: !this.state.isModalVisible2, AssignmentDetail: temp });
    };
    GetAssignments = async () => {
        let userid = firebase.auth().currentUser.uid
        await firebase.database().ref('Users/' + userid +'/Assignments').on('value', (snapshot) => {
            let res = snapshot.toJSON();

            if (res != null) {
                this.setState({ Assignmentslist: res })
            }
        })
    }
    Searchfilter = (v) => {
        this.setState({ searchtext: v })
        let text = v;
        const newData = Object.keys(this.state.Assignmentslist).filter(no => {

            const noname = this.state.Assignmentslist[no].title.toUpperCase();
            const textname = text.toUpperCase();
            return noname.indexOf(textname) > -1
        })
        this.setState({ SearchList: newData })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: '90%', backgroundColor: '#cececd', height: 40, marginTop: 10, borderRadius: 10, padding: 5, flexDirection: 'row' }}>
                    <TextInput onChangeText={(v) => this.Searchfilter(v)} style={{ backgroundColor: 'white', borderRadius: 10, width: '90%' }} />
                    <Icon style={{ color: 'black' }} name='search' />
                </View>
                {
                    this.state.searchtext.length > 0 ?
                        this.state.SearchList.map((data, i) => (
                            this.state.Assignmentslist[data].status === 'que' && <TouchableWithoutFeedback key={i} onPress={() => { this.toggleModal2(data) }}>
                                <View key={i} style={{ marginTop: 10, width: '90%', backgroundColor: '#cececd', borderRadius: 5, padding: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14 }} >{this.state.Assignmentslist[data].title}</Text>
                                    <Text numberOfLines={2} style={{ marginLeft: 10, fontSize: 13 }} >{this.state.Assignmentslist[data].Description}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ))
                        :
                        Object.keys(this.state.Assignmentslist).map((data, i) => (
                            this.state.Assignmentslist[data].status === 'que' && <TouchableWithoutFeedback key={i} onPress={() => { this.toggleModal2(data) }}>
                                <View key={i} style={{ marginTop: 10, width: '90%', backgroundColor: '#cececd', borderRadius: 5, padding: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14 }} >{this.state.Assignmentslist[data].title}</Text>
                                    <Text numberOfLines={2} style={{ marginLeft: 10, fontSize: 13 }} >{this.state.Assignmentslist[data].Description}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ))
                }

                <Modal isVisible={this.state.isModalVisible2}>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, padding: 5 }}>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>

                                <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Title</Text>
                                <Text style={{ marginTop: 10, alignSelf: 'center', fontSize: 16, fontWeight: 'bold' }} >{this.state.AssignmentDetail.title}</Text>

                                <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Due Date</Text>
                                <Text style={{ marginTop: 10, alignSelf: 'center', color: 'red' }} >{this.state.AssignmentDetail.Date}</Text>
                                <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Charges</Text>
                                <Text style={{ marginTop: 10, alignSelf: 'center' }} >{this.state.AssignmentDetail.charges}</Text>
                                <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Description</Text>
                                <Textarea value={this.state.AssignmentDetail.Description} editable={false} style={{ marginTop: 10, height: 200, borderWidth: 1, padding: 3, borderColor: '#cececd', width: '95%', alignSelf: 'center', borderRadius: 10, }} />
                                {Object.keys(this.state.AssignmentDetail.filelist).map((data, i) => (
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(this.state.AssignmentDetail.filelist[data].url)}>
                                        <View key={i} style={{ alignSelf: 'center', marginTop: 10, width: '95%', backgroundColor: '#cececd', borderRadius: 5, height: 50, justifyContent: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', marginLeft: 10 }} >{this.state.AssignmentDetail.filelist[data].name}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}

                            </View>
                            <TouchableWithoutFeedback onPress={() => this.setState({ isModalVisible2: !this.state.isModalVisible2 })}>
                                <View style={{ width: 150, marginTop: 20, alignSelf: 'center', height: 50, backgroundColor: '#B1B9B9', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }} >Back</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

//make this component available to the app
export default memo(Assignments);
