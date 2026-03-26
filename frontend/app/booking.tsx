import { useUser } from "@/store/useStore"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { scheduleEvent } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DatePicker from "react-native-date-picker";


const BookingPage = () => {
  const navigator = useNavigation();
  const userData: any = useUser.getState();

  const [location, setLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null)
  const [departureTime, setDepartureTime] = useState<Date | null>(null)
  const [showDeparturePicker, setShowDeparturePicker] = useState(false)
  const [showArrivalPicker, setShowArrivalPicker] = useState(false)

  const handleDepartureConfirm = (date: Date) => {
    setShowDeparturePicker(false);
    // checking if you schedule a ride in the past.
    if (date < new Date()) {
      Alert.alert("Invalid time. You cannot schedule a ride in the past.");
      return;
    }
    setDepartureTime(date);
  };

  const handleArrivalConfirm = (date: Date) => {
    setShowArrivalPicker(false);
    if (departureTime && date < departureTime) {
      Alert.alert("Invalid time. Arrival time cannot be before the departure time.");
      return;
    }
    setArrivalTime(date);
  };

  const handleBook = async () => {

    // creating book request to the backend
    const response = await scheduleEvent({
      name: "Mark",
      date: new Date(),
      location: location,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      user_id: "1",
      status: "pending"
    })

    console.log(response)

    navigator.goBack();
  }

  return (
    <View className="flex-1 items-center" style={{ backgroundColor: '#9676E5', paddingBottom: 40 }}>
      <View className="mb-6 w-[350px] mt-4">

        <View className="w-full mt-16 mb-8 flex-row justify-start">
          <TouchableOpacity onPress={() => navigator.goBack()}>
            <Text className="text-white text-xl font-semibold underline">Go Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white text-3xl font-semibold">Book a Ride</Text>
      </View>

      <View className="bg-white rounded-2xl p-6 w-[350px] border" style={{ borderColor: '#9676E5' }}>
        <Text className="font-bold text-2xl mb-1 text-[#453B5F]">Hello, {userData.name}.</Text>
        <Text className="text-sm mb-6 text-gray-500">Fill out the details below to schedule your trip.</Text>

        <View>
          <Text className="mt-4 text-base font-semibold" style={{ color: '#453B5F' }}>Enter Destination</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            className="border rounded-lg p-3 mt-1.5 text-base"
            placeholderTextColor="#9676E5"
          />
        </View>

        <View>
          <Text className="mt-4 text-base font-semibold" style={{ color: '#453B5F' }}>Pick-up Time (Going to Destination)</Text>

          <TouchableOpacity
            className="border rounded-lg p-3 mt-1.5"
            onPress={() => setShowDeparturePicker(true)}
          >
            <Text style={{ color: departureTime ? '#453B5F' : '#9676E5' }}>{departureTime ? departureTime.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Select date"}</Text>
          </TouchableOpacity>

          {showDeparturePicker && (
            <DatePicker
              modal
              open={showDeparturePicker}
              date={departureTime ?? new Date()}
              onConfirm={handleDepartureConfirm}
              onCancel={() => {
                setShowDeparturePicker(false)
              }}
            />
          )}
        </View>

        <View>
          <Text className="mt-4 text-base font-semibold" style={{ color: '#453B5F' }}>Return Time (Leaving Destination)</Text>

          <TouchableOpacity
            className="border rounded-lg p-3 mt-1.5"
            onPress={() => setShowArrivalPicker(true)}
          >
            <Text style={{ color: arrivalTime ? '#453B5F' : '#9676E5' }}>{arrivalTime ? arrivalTime.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Select date"}</Text>
          </TouchableOpacity>

          {showArrivalPicker && (
            <DatePicker
              modal
              open={showArrivalPicker}
              date={arrivalTime ?? new Date()}
              onConfirm={handleArrivalConfirm}
              onCancel={() => {
                setShowArrivalPicker(false)
              }}
            />
          )}
        </View>

        <View className="items-center">
          <TouchableOpacity className="rounded-lg mt-6 items-center py-3 px-8 w-40" style={{ backgroundColor: '#9676E5' }} onPress={handleBook}>
            <Text className="text-white text-base font-bold">Book ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BookingPage
