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

    <View className="flex-1 bg-[#9676E5]">

      {/** This mdodal is to set the user id */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 w-80 items-center">
            <Text className="text-xl font-bold mb-5 text-[#453B5F]">Enter User ID (just type 1 for demo)</Text>
            <TextInput
              className="w-full border border-[#9676E5] rounded-lg p-3 mb-5 text-base"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="User ID"
              autoFocus
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity className="bg-[#9676E5] p-3 rounded-lg w-full items-center" onPress={handleSubmit}>
              <Text className="text-white text-base font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="flex-1 bg-[#9676E5] mt-20 justify-center items-center">
        <View className="flex-1 bg-[#9676E5] justify-start w-full items-center">
          <View className="bg-[#9676E5] flex-row items-center gap-2 w-11/12 max-w-sm">
            <Text className="text-white text-3xl font-semibold mb-4 px-2 w-full">DARTS Transportation App</Text>
          </View>

          <View className="bg-white border border-[#9676E5] w-11/12 max-w-sm rounded-3xl p-6 mx-3 mb-8">
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

          <View className="flex-1 bg-white border-t border-[#9676E5] w-full p-6">
            <Text className="text-black text-2xl font-semibold mb-1">Your Scheduled Rides</Text>
            <Text className="text-gray-500 text-lg font-bold mb-3">Monthly cancellations remaining: 3</Text>
            {userId && <EventList userId={userId} />}
          </View>


        </View>



      </View>
    </View>

  );

}
