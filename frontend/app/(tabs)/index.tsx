import { Image } from 'expo-image';
import { Platform, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const name = 'Mark';
  return (

    <ThemedView style={styles.background}>
      <ThemedView style={styles.topbox}>
        <ThemedView style={{ flex: 1, backgroundColor: '#9676E5', justifyContent: 'flex-start', alignItems: 'center' }}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>Welcome {name}!</ThemedText>
            <HelloWave />
          </ThemedView>

          <ThemedView style={styles.container}>
            <ThemedText type="subtitle">Organize a ride.</ThemedText>
            <ThemedView style={styles.row}>

              <TouchableOpacity style={styles.innercontainer} onPress={() => console.log('Button 1 pressed')}              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Google Assistant
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.innercontainer} onPress={() => console.log('Button 2 pressed')}              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Book Manually
                </ThemedText>
              </TouchableOpacity>

            </ThemedView>

          </ThemedView>

          <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={{ height: 350 }}>Your Scheduled Rides</ThemedText>
          </ThemedView>


        </ThemedView>



      </ThemedView>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#9676E5',
    color: "9676E5",
  },
  topbox: {
    marginTop: 90,
    backgroundColor: '#9676E5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontFamily: 'Rounded',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    backgroundColor: '#9676E5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    backgroundColor: '#ffffff',
    paddingTop: StatusBar.currentHeight,
    borderWidth: 1,
    borderColor: '#9676E5',
    width: 350,
    borderRadius: 20,
    padding: 25,
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  innercontainer: {
    flex: 1,
    backgroundColor: '#CDD3EF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#453B5F',
  },


});
