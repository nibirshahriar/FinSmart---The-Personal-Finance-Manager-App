import {Button,Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { Button } from 'react-native/types_generated/index'

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home</Text>
<Button onPress={() => navigation.navigate("Profile")} title="Profile" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});