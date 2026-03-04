import { StyleSheet, View, StatusBar, TextInput, TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { Fonts } from '@/constants/theme';

import { useUser } from '@/store/useStore';

export default function TabTwoScreen() {
    const [name, setName] = useState('');
    const [passengerNumber, setPassengerNumber] = useState('');
    const [mobilityDetails, setMobilityDetails] = useState('');
    const navigator = useNavigation();

    const handleSave = () => {
        console.log('Settings saved:', { name, passengerNumber, mobilityDetails });
        navigator.goBack();
    }

    // fetching global user state
    useEffect(() => {
        const userData: any = useUser.getState();
        setName(userData.name);
        setPassengerNumber(userData.passengerNumber.toString());
        setMobilityDetails(userData.mobilityDetails);
    }, []);

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


            <TouchableOpacity style={styles.buttons} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

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
    buttons: {
        backgroundColor: '#5544f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
