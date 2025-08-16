import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Introduction({navigation}) {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/bg.jpg')}
                style={styles.backgroundImage}
                resizeMode='cover'
            >
               <View style={styles.overlay}>
                    <Text style={styles.logo}>CafeMoring ☕🌸</Text>
                </View>
                <TouchableOpacity style={styles.overlay1} onPress={() => navigation.navigate('Aesthetic')}>  
                    <Text style={styles.cat}>Aesthetic Images</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.overlay1} onPress={() => navigation.navigate('Recipes')}>  
                    <Text style={styles.cat}>Recipes</Text>
                </TouchableOpacity>
                 <View style={styles.overlay1}>
                    <Text style={styles.cat}>Cafe music palylist</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute', 
        width: width,        
        height: height,      
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50, 
        spacing:20
    },
     overlay: {
       
        backgroundColor: 'rgba(64, 53, 53, 0.8)',
        paddingHorizontal:60,
        height:100,
        width:width-30,
        paddingVertical: 30,
        borderRadius:8,
        marginBottom: 40
    },
    logo: {
        fontSize: 25,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    overlay1: {
        backgroundColor: 'rgba(99, 69, 62, 0.7)',
        paddingHorizontal:90,
        height:100,
        width:width-30,
        paddingVertical: 30,
        borderRadius:8,
        marginBottom:10
    },
     cat: {
        fontSize: 20,
        color: '#0202029a',
        fontWeight: 'bold',
    },
});
