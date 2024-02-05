import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Nav from './screens/Nav';

const API = "https://rickandmortyapi.com/api/"; // Call Rick and Morty API

class CharacterCard extends Component { // Fetch method for individual characters
  render() {
    const { character, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.row}>
          <Image source={{ uri: character.image }} style={styles.image} resizeMode="contain" />
          <View style={styles.column}>
            <Text style={[styles.text, { fontWeight: "bold" }]}>{character.name}</Text>
            <Text style={styles.text}>{character.species}</Text>
            <Text style={styles.text}>{character.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
                    // Instantiate variables
    this.state = { 
      characters: [],
      currentPage: 1,
      totalPages: 0,
      modalVisible: false,
      selectedCharacter: null,
      selectedGender: '',
    };
  }

  getCharacters(page = 1, scrollToTop = true) { // Call method for the characters of API
    const { selectedGender } = this.state;
  
    let url = `${API}character/?page=${page}`;
  
    // Apply Gender Filter only when a filter is selected
    if (selectedGender && selectedGender !== 'all') {
      url += `&gender=${selectedGender}`;
    }
  
    axios
      .get(url)
      .then((response) => {
        let newData = response.data && response.data.results || [];
  
        this.setState({
          characters: newData,
          totalPages: response.data && response.data.info.pages || 0,
          currentPage: page,
        });
  
        if (scrollToTop) {
          this.flatListRef.scrollToIndex({ index: 0, animated: true });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  
  openModal(character) { // Modal logic
    this.setState({ modalVisible: true, selectedCharacter: character });
  }

  closeModal() {
    this.setState({ modalVisible: false, selectedCharacter: null });
  }

  componentDidMount() { // get character information at startup
    this.getCharacters();
  }


  render() { // Code for User Interface and Fetch Logic
    const { modalVisible, selectedCharacter, currentPage, totalPages, selectedGender } = this.state;

    return ( 
      <View style={styles.container}> 
        <Nav /> 
        <View style={styles.filterContainer}>
          <Text>Filter by Gender:</Text> 
          <Picker // Filter Gender Code
            selectedValue={selectedGender}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => this.setState({ selectedGender: itemValue }, () => this.getCharacters())}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Genderless" value="genderless" />
            <Picker.Item label="Unknown" value="unknown" />
          </Picker>
        </View>
        <FlatList // Call API using FlatList
          ref={(ref) => (this.flatListRef = ref)}
          style={styles.list}
          data={this.state.characters}
          renderItem={({ item, index }) => (
            <CharacterCard
              character={item}
              onPress={() => this.openModal(item)}
            />
          )}
          ListFooterComponent={() => ( // Pagination Buttons
            <View style={styles.paginationContainer}>
              <Button 
                style={styles.btn}
                color="#203745"
                title="Previous Page"
                onPress={() => this.getCharacters(this.state.currentPage - 1)}
                disabled={this.state.currentPage === 1}
              />
              <Text>{`Page ${this.state.currentPage} of ${this.state.totalPages}`}</Text>
              <Button 
                style={styles.btn}
                color="#203745"
                title="Next Page"
                onPress={() => this.getCharacters(this.state.currentPage + 1, true)}
                disabled={this.state.currentPage === this.state.totalPages}
              />
            </View>
          )}
        />
        <Modal // Modal code for individual character information
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => this.closeModal()}
        >
          <View style={styles.modalContainer}>
            {selectedCharacter && (
              <>
                <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
                <Image source={{ uri: selectedCharacter.image }} style={styles.image2} resizeMode="contain" />
                <Text style={styles.modalStatus}>{selectedCharacter.status}</Text>
                <Text style={styles.modalText}><Text style={ { fontWeight: "bold" }}>Gender: </Text> {selectedCharacter.gender}</Text>
                <Text style={styles.modalText}><Text style={ { fontWeight: "bold" }}>Origin: </Text> {selectedCharacter.origin.name}</Text>
                <Text style={styles.modalText}><Text style={ { fontWeight: "bold" }}>Location: </Text> {selectedCharacter.location.name}</Text>
              </>
            )}
            <TouchableOpacity style={styles.close} onPress={() => this.closeModal()}>
              <Text style={ { fontSize: 20, fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBE7C6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: 150,
    height: 150,
  },
  image2: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#41b4c9',
    borderRadius: 10,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBE7C6',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  modalText: {
    fontSize: 25,
    marginBottom: 30,
  },
  modalStatus: {
    fontSize: 25,
    fontWeight: 'bold',
    backgroundColor: '#41b4c9',
    borderLeftWidth: 100,
    textAlign: 'center',
    borderColor: '#41b4c9',
    borderRadius: 5,
    marginBottom: 30,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  btn: {
    borderRadius: 10,
  },
  close: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#bfde42',
    borderRadius: 5,
  }
});

export default App;
