import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const token = await response.text(); 

      if (response.ok) {
      
        await AsyncStorage.setItem('token', token);

        Alert.alert("Success", "Logged in!");
        console.log("Token stored:", token);

        navigation.navigate("PlayList"); 
      } else {
        Alert.alert("Error", token);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Check your connection.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.4 }}
        resizeMode='cover'
      >
        <Text style={styles.title}>Login</Text>
        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
        />
        <TextInput 
          placeholder="Password" 
          style={styles.input} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#484846', padding: 15, borderRadius: 8 },
  buttonText: { color: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
  link: { marginTop: 15, textAlign: 'center', color: '#007bff', fontWeight:"bold" },
  backgroundImage: { position: 'absolute', width: width, height: height, paddingTop: 50 }
});
