import React, { useLayoutEffect, useState } from 'react'
import { TouchableWithoutFeedback, ScrollView, TextInput, Keyboard, Platform, SafeAreaView, StatusBar, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import * as firebase from 'firebase'
import { auth, db } from '../firebase'
import { data } from 'browserslist'

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])

    const sendMessage = () => {
        Keyboard.dismiss()

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput('')
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection("chats").doc(route.params.id).collection("messages").orderBy("timestamp", "desc").onSnapshot((snapshot) => setMessages(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }))
        ))
        return unsubscribe

    }, [route])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Avatar 
                        rounded
                        source={{
                            uri: messages[0]?.data.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo38tCnX_HjKgFyft_g7SeKWrA9IqaS3dgnNJVmwe77ceNSy04aJjtk-ik3xo0VWjXG7Y&usqp=CAU",
                        }}
                    />
                    <Text style={{color: "white", marginLeft: 10, fontWeight: 700}}>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                            {messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar 
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                            rounded
                                            size={30}
                                            source={{ 
                                                uri: data.photoURL, 
                                            }}
                                            // For the web
                                            containerStyle={{ position: "absolute", bottom: -15, right: -5}}
                                        />
                                        <Text style={styles.recieverText}>{ data.message }</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            position="absolute"
                                            bottom={-15}
                                            left={-5}
                                            rounded
                                            size={30}
                                            source={{ 
                                                uri: data.photoURL, 
                                            }}
                                            // For the web
                                            containerStyle={{ position: "absolute", bottom: -15, left: -5}} 
                                        />
                                        <Text style={styles.senderText}>{ data.message }</Text>
                                        <Text style={styles.senderName}>{ data.displayName }</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>

                        <View style={styles.footer}>
                            <TextInput onSubmitEditing={sendMessage} value={input} onChangeText={text => setInput(text)} placeholder="Signal Message" style={styles.textInput} />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        flexDirection: "row", 
        alignItems: "center", 
        width: "100%",
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "gray",
        borderRadius: 30
    },
    reciever: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    recieverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white"
    }
})
