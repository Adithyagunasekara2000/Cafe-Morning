import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';


const {width,height}=Dimensions.get("window");

export default function Registration ({ navigation }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const handleRegister = async () => {
  if (!email || !fullName || !password || !confirmPassword) {
    Alert.alert('Error', 'Please fill all fields');
  } else if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
  } else {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        Alert.alert("Success", data);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Check your connection.");
    }
  }
};


  return (
    <View style={styles.container}>
         <ImageBackground
                        source={require('../assets/bg.jpg')}
                        style={styles.backgroundImage}
                        resizeMethod='cover'
                         imageStyle={{ opacity: 0.2 }}
                        >
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Full Name" style={styles.input} onChangeText={setFullName} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Confirm Password" style={styles.input} onChangeText={setConfirmPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 8,width:'98%' },
  button: { backgroundColor: '#484846', padding: 15, borderRadius: 8 },
  buttonText: { color: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
  link: { marginTop: 15, textAlign: 'center', color: '#007bff',fontWeight:"bold" },
      backgroundImage: {
        position: 'absolute', 
        width: width,        
        height: height,      
       
    },
});
