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
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend (messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
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