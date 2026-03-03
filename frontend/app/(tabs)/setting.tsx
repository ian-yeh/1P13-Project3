import { Image } from 'expo-image';
import { Platform, StyleSheet, View, StatusBar, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';




export default function TabTwoScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
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
                <TextInput style={styles.inputs} />
            </View>

            <ThemedText>Passenger number:</ThemedText>
            <View style={styles.container}>
                <TextInput style={styles.inputs} />
            </View>

            <ThemedText>Details on Mobility devices/companions:</ThemedText>
            <View style={styles.container}>
                <TextInput style={styles.inputs} />
            </View>


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
    }
});
