import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const firebaseConfig = {
  apiKey: "AIzaSyA-OwFTrkVZ14yYughJAuAPKfXVbX-GOVs",
  authDomain: "test-37e9d.firebaseapp.com",
  projectId: "test-37e9d",
  storageBucket: "test-37e9d.appspot.com",
  messagingSenderId: "307865303179"
};

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      uid: 0,
      messages: [],
      isConnected: false
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = null;
  }

  componentDidMount () {
    //check whether user is online
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        //check if user is signed in, if not create a new user
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          // create a reference to the collection 'messages' of the firestore db
          this.referenceChatMessages = firebase.firestore().collection('messages');
          this.setState({
            uid: user.uid,
            isConnected: true
          });
          //create a snapshot every time the referenced collection gets updated
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        // if user is offline fetch messages from asyncStorage
        this.getMessages();
      }
    });
  }

  componentWillUnmount () {
    // when component unmounts stop receiving updates
    this.unsubscribe();
    this.authUnsubscribe();
  }

  // set up function to retrieve current data in collection and store in app's state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
      this.setState({
        messages
      });
    });
  };

  // retrieve messages from asyncStorage when user is offline and store it in app's state
  async getMessages () {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // when sending a message, update app's state
  onSend (messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      // save messages to asyncStorage
      this.saveMessages();
    });
    this.addMessage(messages);
  }

  // saves current messages from app's state to asyncStorage
  async saveMessages () {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // add's new message to Firestore
  addMessage = (message) => {
    this.referenceChatMessages.add({
      _id: message[0]._id,
      text: message[0].text,
      createdAt: message[0].createdAt,
      user: message[0].user
    });
  };

  // deletes all messages from asyncStorage
  async deleteMessages () {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // '#090C08', '#474056', '#8A95A5', '#B9C6AE';
  // customize message bubble appearances
  renderBubble (props) {
    const { backgroundColor } = this.props.route.params;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: backgroundColor === '#090C08' ? '#8A95A5' :
              (backgroundColor === '#474056' || backgroundColor === '#8A95A5') ? '#B9C6AE' : '#474056'
          }
        }}
      />
    );
  }

  renderInputToolbar (props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  render () {
    // decompose properties that got passed from Start-Screen through navigation
    let { name, backgroundColor } = this.props.route.params;
    // sets the title of the navigation bar to the user's name
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, styles.setColor(backgroundColor)]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name
          }}
          isTyping={true}
          alwaysShowSend={true}
        />
        {/* ensure the input field won't be hidden beneath the keyboard for android*/}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
};

// TODO: add accessibility props to the action button implemented

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10
  },
  // set the font color either to white or black conditionally to the background color for readability reasons
  text: (bgcolor) => ({
    fontSize: 16,
    fontWeight: '300',
    color: (bgcolor === '#090C08' || bgcolor === '#474056') ? '#fff' : 'black'
  }),
  setColor: (bgcolor) => ({
    backgroundColor: bgcolor
  })
});