import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { firestore } from '../firebase/Config';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const ShoppingList = () => {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'ShoppingList'), (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched items from Firestore:", itemsData);
      setItems(itemsData);
    });

    return unsubscribe;
  }, []);

  const addItem = async () => {
    if (itemName.trim()) {
      console.log("Adding item:", itemName);
      await addDoc(collection(firestore, 'ShoppingList'), { name: itemName });
      setItemName('');
    }
  };

  const deleteItem = async (id) => {
    console.log("Deleting item with ID:", id);
    await deleteDoc(doc(firestore, 'ShoppingList', id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.header}>Shopping List</Text>

        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          value={itemName}
          onChangeText={(text) => setItemName(text)}
          onSubmitEditing={addItem}
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No items yet.</Text>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ShoppingList;
