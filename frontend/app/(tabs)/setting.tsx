import { Image } from 'expo-image';
import { Platform, StyleSheet, View, StatusBar, TextInput } from 'react-native';
import { useState } from 'react';
import { React } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Button } from '@react-navigation/elements';


type ButtonType = {
    children: string;
    colorscheme: 'light' | 'dark' | "red" | "blue";
}

export default function TabTwoScreen() {
    const [name, setName] = useState('');
    const [passengerNumber, setPassengerNumber] = useState('');
    const [mobilityDetails, setMobilityDetails] = useState('');
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#411919', dark: '#99c7c7' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#adf7f0"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText
                    type="title"
                    style={{
                        fontFamily: Fonts.rounded,
                    }}>
                    Settings
                </ThemedText>
            </ThemedView>
            <ThemedText>Here is where the settings will be:</ThemedText>

            <ThemedText>Full Name:</ThemedText>
            <View style={styles.container}>
                <TextInput style={styles.inputs} value={name} onChangeText={setName} />
            </View>

            <ThemedText>Passenger number:</ThemedText>
            <View style={styles.container}>
                <TextInput style={styles.inputs} value={passengerNumber} onChangeText={setPassengerNumber} />
            </View>

            <ThemedText>Details on Mobility devices/companions:</ThemedText>
            <View style={styles.container}>
                <TextInput style={styles.inputs} value={mobilityDetails} onChangeText={setMobilityDetails} />
            </View>

            <ThemedText> {name} | {passengerNumber} | {mobilityDetails}</ThemedText>

            <Button colorscheme="blue" onPress={() => navigation.goBack()}>Save</Button>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: StatusBar.currentHeight,
    },
    inputs: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

});
