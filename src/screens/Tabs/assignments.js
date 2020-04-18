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
        isModalVisible: false,
        isModalVisible2: false,
        chosenDate: new Date(),
        Assignmentlist: [{ title: 'Title 1', name: 'Description ' }, { title: 'Title 2', name: 'i want to need this task asap' }, { title: 'Title 3', name: 'this is a simple paragraph that is meant to be nice and easy to type which is why there will be mommas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph' }],
        Assignmentslist: [],
        filelist: [],
        title: '',
        Duedate: 'Select Date',
        Charges: '',
        Description: '',
        searchtext: '',
        SearchList: [],
        AssignmentDetail: {
            title: '',
            Date: '',
            charges: '',
            Description: '',
            filelist: [],
            uploadfiles: []
        }

    };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    // toggleModal2 = () => {
    //     this.setState({ isModalVisible2: !this.state.isModalVisible2 });
    // };
    componentDidMount() {
        this.GetAssignments()
    }
    operner = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(),
                mode: 'spinner'
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                this.setState({ Duedate: month + "/" + day + "/" + year })
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    UploadUserData = async () => {
        let userid = firebase.auth().currentUser.uid
        let userdata = {
            title: this.state.title,
            duedate: this.state.Duedate,
            Charges: this.state.Charges,
            Description: this.state.Description,
            fileuri: this.state.filelist,
            status: 'request',
            userid: userid
        }

        let assignmentid = await firebase.database().ref('Users/' + userid + "/Assignments").push(userdata)
            .then(res => {
                // alert(res.key)
                return res.key
            });
        this.toggleModal();
        await firebase.database().ref('Assignments/' + assignmentid).set(userdata);
        this.setState({
            title: '',
            Duedate: 'Select Date',
            Charges: '',
            Description: '',
            filelist: []
        })
    }
    Uploadfile = async () => {

        let result = await DocumentPicker.getDocumentAsync()
        if (result.name != undefined) {
            const { height, width, type, uri, name } = result;

            this.uploadImage(result.uri, name)
                .then(snapshot => {
                    //Alert.alert("success");   
                    return snapshot.ref.getDownloadURL();

                })
                .then(downloadURL => {
                    console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
                    let temp = this.state.filelist;
                    temp.push({ name: name, url: downloadURL })
                    this.setState({ filelist: temp })
                    // Alert.alert(downloadURL);

                    //Linking.openURL(downloadURL);
                    return downloadURL;

                })
                .catch((error) => {
                    Alert.alert(error);
                    console.log(error);
                    return null;

                });
        }
    }
    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);

        const blob = await response.blob();
        const ref = firebase.storage().ref().child("image/" + imageName);

        return ref.put(blob);
    }
    GetAssignments = async () => {
        let userid = firebase.auth().currentUser.uid
        await firebase.database().ref('Users/' + userid + '/Assignments').on('value', (snapshot) => {
            let res = snapshot.toJSON();
            console.log(snapshot.toJSON())
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
    toggleModal2 = (data) => {
      //  console.log(this.state.Assignmentlist[data])
        let temp = this.state.AssignmentDetail
        temp.title = this.state.Assignmentslist[data].title;
        temp.Description = this.state.Assignmentslist[data].Description;
        temp.Date = this.state.Assignmentslist[data].duedate;
        temp.charges = this.state.Assignmentslist[data].Charges;
        temp.filelist = this.state.Assignmentslist[data].fileuri;
        temp.uploadfiles = this.state.Assignmentslist[data].uploadfiles;
        this.setState({ isModalVisible2: !this.state.isModalVisible2, AssignmentDetail: temp });
    };
    render() {
        return (
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '90%', marginTop: 10 }}>

                    <TouchableWithoutFeedback onPress={() => this.toggleModal()}>
                        <View style={{ width: '100%', height: 50, backgroundColor: '#B1B9B9', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                            <Text style={{ color: 'white' }} >Upload Assignment</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                <View style={{ width: '90%', backgroundColor: '#cececd', height: 40, marginTop: 10, borderRadius: 10, padding: 5, flexDirection: 'row' }}>
                    <TextInput onChangeText={(v) => this.Searchfilter(v)} style={{ backgroundColor: 'white', borderRadius: 10, width: '90%' }} />
                    <Icon style={{ color: 'black' }} name='search' />
                </View>
                {
                    this.state.searchtext.length > 0 ?
                        this.state.SearchList.map((data, i) => (
                            this.state.Assignmentslist[data].status === 'done' && <TouchableWithoutFeedback key={i} onPress={() => this.toggleModal2(data)}>
                                <View key={i} style={{ marginTop: 10, width: '90%', backgroundColor: '#cececd', borderRadius: 5, padding: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14 }} >{this.state.Assignmentslist[data].status}</Text>
                                    <Text numberOfLines={2} style={{ marginLeft: 10, fontSize: 13 }} >{this.state.Assignmentslist[data].Description}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ))
                        :
                        Object.keys(this.state.Assignmentslist).map((data, i) => (
                            this.state.Assignmentslist[data].status === 'done' && <TouchableWithoutFeedback key={i} onPress={() => this.toggleModal2(data)}>
                                <View key={i} style={{ marginTop: 10, width: '90%', backgroundColor: '#cececd', borderRadius: 5, padding: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14 }} >{this.state.Assignmentslist[data].title}</Text>
                                    <Text numberOfLines={2} style={{ marginLeft: 10, fontSize: 13 }} >{this.state.Assignmentslist[data].Description}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ))}

                <Modal isVisible={this.state.isModalVisible}>
                    <ScrollView>
                        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
                            <TouchableWithoutFeedback onPress={() => this.Uploadfile()}>
                                <View style={{ width: '70%', marginTop: 10, alignSelf: 'center', height: 180, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B1B9B9', borderRadius: 10 }}>
                                    <Image source={require('../../assets/uploadfile.png')} style={{ width: 90, height: 90 }} />
                                    <Text style={{ marginTop: 20 }}>
                                        Upload File
                                     </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Title</Text>
                            <TextInput style={{ marginTop: 10, borderWidth: 1, padding: 3, borderColor: '#cececd', width: '90%', alignSelf: 'center', borderRadius: 10, marginLeft: 10 }} value={this.state.title} onChangeText={(value) => this.setState({ title: value })} />

                            <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Due Date</Text>
                            <Text style={{ marginTop: 10, alignSelf: 'center' }} onPress={() => this.operner()}>{this.state.Duedate}</Text>

                            <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Charges</Text>
                            <TextInput style={{ marginTop: 10, borderWidth: 1, padding: 3, borderColor: '#cececd', width: '90%', alignSelf: 'center', borderRadius: 10, marginLeft: 10 }} value={this.state.Charges} onChangeText={(value) => this.setState({ Charges: value })} />
                            <Text style={{ marginTop: 10, fontWeight: 'bold', marginLeft: 10 }}>Description</Text>
                            <Textarea style={{ marginTop: 10, borderWidth: 1, padding: 3, borderColor: '#cececd', width: '90%', alignSelf: 'center', borderRadius: 10, }} value={this.state.Description} onChangeText={(value) => this.setState({ Description: value })} />
                            {this.state.filelist.map((data, i) => (
                                <View key={i} style={{ alignSelf: 'center', marginTop: 10, width: '95%', backgroundColor: '#cececd', borderRadius: 5, height: 50, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', marginLeft: 10 }} >{data.name}</Text>
                                </View>
                            ))}
                            <TouchableWithoutFeedback onPress={() => this.UploadUserData()}>
                                <View style={{ width: 150, marginTop: 20, alignSelf: 'center', height: 50, backgroundColor: '#B1B9B9', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }} >Upload</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>
                </Modal>
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
                                {Object.keys(this.state.AssignmentDetail.uploadfiles).map((data, i) => (
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL(this.state.AssignmentDetail.uploadfiles[data].url)}>
                                        <View key={i} style={{ alignSelf: 'center', marginTop: 10, width: '95%', backgroundColor: '#cececd', borderRadius: 5, height: 50, justifyContent: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', marginLeft: 10 }} >{this.state.AssignmentDetail.uploadfiles[data].name}</Text>
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
