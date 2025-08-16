import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
    } else {
      Alert.alert('Success', 'Logged in!');
      navigation.navigate('PlayList');
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
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#484846', padding: 15, borderRadius: 8 },
  buttonText: { color: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
  link: { marginTop: 15, textAlign: 'center', color: '#007bff',fontWeight:"bold" },
   backgroundImage: {
        position: 'absolute', 
        width: width,        
        height: height,      
        
        paddingTop: 50, 
        spacing:20
    },
});
