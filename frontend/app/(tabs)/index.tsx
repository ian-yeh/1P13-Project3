import { StyleSheet, StatusBar, TouchableOpacity, Modal, TextInput, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { getUser } from '@/api/api';
import { useUser } from '@/store/useStore';
import { EventList } from '@/components/homepage/event-list';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [userId, setUserId] = useState<string | null>('');
  const [showModal, setShowModal] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const name = 'Mark';

  useEffect(() => {
    if (!userId) {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setUserId(inputValue.trim());

      // fetch user details
      const response = await getUser(inputValue.trim());
      useUser.setState({
        userId: inputValue.trim(),
        name: response.name,
        passengerNumber: response.passenger_number,
        mobilityDetails: response.mobility_details
      });

      setShowModal(false);
    }
  };

  return (

    <View style={styles.background}>

      {/** This mdodal is to set the user id */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter User ID (just type 1 for demo)</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="User ID"
              autoFocus
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.topbox}>
        <View style={{ flex: 1, backgroundColor: '#9676E5', justifyContent: 'flex-start' }}>
          <View style={styles.titleContainer}>
            <Text className="text-white text-3xl font-semibold mb-4 px-4">DARTS Transportation App</Text>
          </View>

          <View style={styles.container}>
            <Text className="text-xl font-semibold">Book a Ride</Text>
            <View className="flex-row gap-3 mt-4">
              <Link
                href={"/voice"}
                className="flex-1 bg-[#CDD3EF] p-3 rounded-lg overflow-hidden text-center"
              >
                <Text className="font-semibold text-base text-[#453B5F]">
                  Voice Assistant
                </Text>
              </Link>
              <Link
                href={"/booking"}
                className="flex-1 bg-[#CDD3EF] p-3 rounded-lg overflow-hidden text-center"
              >
                <Text className="font-semibold text-base text-[#453B5F]">
                  Book Manually
                </Text>
              </Link>
            </View>

          </View>

          <View style={styles.scheduledRides}>
            <Text className="text-black text-xl font-semibold" style={{ marginBottom: 12 }}>Your Scheduled Rides</Text>
            {userId && <EventList userId={userId} />}
          </View>


        </View>



      </View>
    </View>

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
    padding: 24,
    margin: 10,
  },
  scheduledRides: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#9676E5',
    width: 350,
    borderRadius: 20,
    padding: 25,
    margin: 10,
    marginBottom: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#453B5F',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#9676E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#9676E5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },


});
