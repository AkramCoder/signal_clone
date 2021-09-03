import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log("Login screen", authUser)
            if(authUser) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            }
        })

        return unsubscribe
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => console.log(error))
    }

    

    return (
        <View behavior="padding" enabled style={styles.container}>
            <StatusBar style="light" />
            <Image
                source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Signal_ultramarine_icon.svg/1200px-Signal_ultramarine_icon.svg.png",
                    
                }} 
                style={{ width: 100, height: 100 }}
            />
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input onSubmitEditing={signIn} placeholder="Password" secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)} />
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title="Login" /> 
            <Button onPress={() => navigation.navigate('Register')} containerStyle={styles.button} type="outline" title="Register" /> 
            <View style={{ height: 100 }}/>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    }
  });
