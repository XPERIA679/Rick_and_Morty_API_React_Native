import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

class Nav extends Component {

    render() {
      return ( // Rick and Morty Logo for Navigation Bar
        <View style={styles.container}>
              <Image source={require('../imgs/logo.png')} style={styles.img}/>
          </View>
      );
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 12,
    },
    img: {
        width: 180, 
        height: 48,
    },
})

export default Nav;