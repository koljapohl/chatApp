import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends Component {
  render () {
    // decompose properties that got passed from Start-Screen through navigation
    let { name, backgroundColor } = this.props.route.params;
    // sets the title of the navigation bar to the user's name
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.wrapper, styles.setColor(backgroundColor), { flex: 1 }]}>
        <Text style={styles.text(backgroundColor)}>Hello Chat!</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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