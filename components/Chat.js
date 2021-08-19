import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount () {
    // decompose the user's name that got sent from Start screen as a parameter
    const { name } = this.props.route.params;
    // set initial messages
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: `Hi ${name} you entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  // when a user sends a message it will be appended to the local messages state
  onSend (messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
          },
          // left: {
          //   backgroundColor: backgroundColor === '#090C08' ? '#B9C6AE' :
          //     (backgroundColor === '#474056' || backgroundColor === '#8A95A5') ? '#090C08' : '#8A95A5',
          //   color: (backgroundColor === '#090C08' || backgroundColor === '#474056') ? '#ffffff' : '#090C08'
          // }
        }}
      />
    );
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
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
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