import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, LogBox } from 'react-native';
import MapView from 'react-native-maps';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import firebase from './firebase';
import 'firebase/firestore';
import CustomActions from './CustomActions';

LogBox.ignoreLogs(['Setting a timer']);

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      uid: '',
      messages: [],
      isConnected: false,
      user: {
        _id: '',
        name: ''
      },
      image: null,
      location: null
    };

    // create a reference to the collection 'messages' of the firestore db
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  componentDidMount () {
    //check whether user is online
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        //create a snapshot every time the referenced collection gets updated
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
        this.saveMessages();
        //check if user is signed in, if not create a new user
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.props.route.params.name
            }
          });
        });
      } else {
        console.log('offline');
        // if user is offline fetch messages from asyncStorage
        this.getMessages();
      }
    });
  }

  componentWillUnmount () {
    if (this.state.isConnected) {
      // when component unmounts stop receiving updates
      this.unsubscribe();
      this.authUnsubscribe();
    } else {
      this.deleteMessages();
    }
  }

  // set up function to retrieve current data in collection and store in app's state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || null,
        image: data.image || null,
        location: data.location || null,
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
      // saves messages to firestore
      this.addMessage();
      // save messages to asyncStorage
      this.saveMessages();
    });
  };

  // saves current messages from app's state to asyncStorage
  async saveMessages () {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // add's new message to Firestore
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || null,
      image: message.image || null,
      location: message.location || null,
      createdAt: message.createdAt,
      user: message.user
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

  // when user is offline input toolbar is not rendered
  renderInputToolbar (props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  //renders the actionButton
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // renders user's location with MapView inside a chat bubble
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  }

  render () {
    // decompose properties that got passed from Start-Screen through navigation
    let { name, backgroundColor } = this.props.route.params;
    let offlineTitle = this.state.isConnected
      ? '' : ' offline';
    // sets the title of the navigation bar to the user's name
    this.props.navigation.setOptions({
      title: `${name} ${offlineTitle}`
    });

    return (
      <View style={[styles.container, styles.setColor(backgroundColor)]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          isTyping={true}
          alwaysShowSend={true}
        />
        {/* ensure the input field won't be hidden beneath the keyboard for android*/}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
};

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