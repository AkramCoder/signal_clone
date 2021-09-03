import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Image, Text } from 'react-native-elements'
import { auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    useLayoutEffect(() => {
        console.log(navigation)
        navigation.setOptions({
            headerBackTitle: "Back to Login"
        });
    }, [navigation])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || 
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo38tCnX_HjKgFyft_g7SeKWrA9IqaS3dgnNJVmwe77ceNSy04aJjtk-ik3xo0VWjXG7Y&usqp=CAU"
                    
                })
            })
            .catch(error => console.log(error))
    }

    return (
        <View behavior="padding" enabled style={styles.container}>
            <StatusBar style="light" />

            <Text h3 style={{ marginBottom: 50 }}>
                I am the register
            </Text>

            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Full Name"
                    autoFocus
                    type="text"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input 
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input 
                    placeholder="Password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input 
                    placeholder="Profile picture URL (optional)"
                    type="text"
                    value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)}
                />

            </View>

            <Button containerStyle={styles.button} raised onPress={register} title="Register" />
        </View>
    )
}

export default RegisterScreen

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
})