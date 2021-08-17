import React, { Component } from 'react';
import { StyleSheet, ImageBackground, KeyboardAvoidingView, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

// definition of color options
const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backgroundColor: '#8A95A5' // default value is defined, so a user does not have to select a color explicitly
    };
  }

  goToChat = (name, backgroundColor) => {
    // check if user entered its name otherwise alert
    if (this.state.name === '') {
      return Alert.alert('Please enter your name');
    }
    // navigate to Chat View and pass 'name' and 'backgroundColor' properties to it
    this.props.navigation.navigate('Chat', {
      name,
      backgroundColor
    });
  };

  render () {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/img/BackgroundImage.png')} resizeMode='cover' style={styles.backgroundImage}>
          {/* use of KeyboardAvoidingView so that the design of the input wrapper will remain when the keyboard pops up*/}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.view}
            contentContainerStyle={{ justifyContent: 'space-evenly', alignItems: 'center' }}
          >
            <Text style={styles.title}>WeChat</Text>
            <View style={[styles.wrapper, styles.inputWrapper]}>
              <TextInput
                style={[styles.text, styles.nameInput]}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Your Name'
              />
              <Text style={styles.text}>
                Choose Background Color:
              </Text>
              <View style={[styles.wrapper, styles.colorWrapper]}>
                {/* map colors of colorOptions to one button each*/}
                {/*if the button is the selected color one, apply the styling rules of 'border' [make it a circle instead of a rectangular]*/}
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Select Background Color"
                    accessibilityHint="Selects the background color of the chat screen"
                    accessibilityRole="button"
                    style={[styles.colorOptions(color),
                    color === this.state.backgroundColor ? styles.border : null]}
                    key={color}
                    activeOpacity={0.5}
                    onPress={() => this.setState({ backgroundColor: color })}
                  />
                ))}
              </View>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Go to chat"
                accessibilityHint="Takes you to the chat room"
                accessibilityRole="button"
                style={styles.button}
                onPress={() => this.goToChat(this.state.name, this.state.backgroundColor)}>
                <Text style={[styles.text, styles.buttonText]}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    width: '100%',
    height: '100%'
  },
  view: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff'
  },
  wrapper: {
    width: '88%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083'
  },
  inputWrapper: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: '44%'
  },
  nameInput: {
    padding: 10,
    borderColor: '#757083',
    borderWidth: 1,
    opacity: 0.5,
    width: '88%',
    height: 60,
  },
  colorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  colorOptions: (selectedColor) => ({
    backgroundColor: selectedColor,
    width: 40,
    height: 40
  }),
  border: {
    borderRadius: 20
  },
  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  buttonText: {
    fontWeight: '600',
    color: '#ffffff'
  }
});
