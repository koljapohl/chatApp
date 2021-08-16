import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to chatApp</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
          placeholder='Type in your name'
        />
        <Button
          style={styles.button}
          title="Go to Chat"
          onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 30,
    fontWeight: '500'
  },
  nameInput: {
    marginTop: 30,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    height: 40,
    fontSize: 16
  },
  button: {
    backgroundColor: '#00975f',
    color: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    width: 30,
    height: 20
  }
});
