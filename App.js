import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

/* creates the navigator stack */
const Stack = createStackNavigator();

export default class App extends Component {
  render () {
    return (
      <NavigationContainer>
        {/* initalRouteName specifies the entry screen */}
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}