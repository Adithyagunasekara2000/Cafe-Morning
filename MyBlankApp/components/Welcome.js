import React, {  useEffect } from 'react';
import {View,Text,StyleSheet,ImageBackground, Dimensions} from "react-native";

const {width,height}=Dimensions.get("window");


export default function Welcome({navigation}){
    useEffect(() => {
        const timer=setTimeout(()=>{
            navigation.replace("Introduction"); 
        },3000);
    return ()=>clearTimeout(timer); 
    },[]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/bg.jpg')}
                style={styles.backgroundImage}
                resizeMethod='cover'
                >
                    <View style={styles.overlay}>
                    <Text style={styles.logo}>CafeMoring ☕🌸</Text>
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
        position: 'absolute', // lock in place
        width: width,        // full screen width
        height: height,      // full screen height
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(64, 53, 53, 0.8)', // Semi-transparent overlay
        paddingHorizontal:80,
        height:150,
        width:width-30,
        paddingVertical: 60,
        borderRadius:8,
    },
    logo: {
        fontSize: 25,
        color: '#FFD700',
        fontWeight: 'bold',
    },
})

