import { useUser } from "@/store/useStore"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { scheduleEvent } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';


const BookingPage = () => {
  const navigator = useNavigation();
  const userData: any = useUser.getState();

  const [location, setLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date>(new Date())
  const [departureTime, setDepartureTime] = useState<Date>(new Date())

  const handleBook = async () => {
      const response = await scheduleEvent({
        name: "Mark",
        date: "2026-03-05T19:15:11.660Z",
        location: location,
        arrival_time: arrivalTime || "2026-03-05T19:15:11.660Z",
        departure_time: departureTime || "2026-03-05T19:15:11.660Z",
        user_id: "1"
      })

      console.log(response)

      navigator.goBack();
  }

  return (
    <View className="bg-white h-full px-4 py-8">
      <Text className="text-black font-bold text-3xl">Book your ride, {userData.name}.</Text>

      <View>
        <Text className="mt-4">Where do you want to go?</Text>
        <TextInput 
          value={location} 
          onChangeText={setLocation} 
          className="border-2 border-gray-200 p-2 mt-1 rounded-lg"
        />
      </View>

      <View>
        <Text className="mt-4">Departure Time</Text>
        <DateTimePicker 
          value={departureTime}
          mode="date"
          onChange={(event, date) => {
            if (date) setDepartureTime(date)
          }}
        />
      </View>

      <View>
        <Text className="mt-4">Arrival Time</Text>
        <DateTimePicker 
          value={arrivalTime}
          mode="date"
          onChange={(event, date) => {
            if (date) setArrivalTime(date)
          }}
        />
      </View>

      <TouchableOpacity className="flex items-center p-2 bg-blue-200 w-36 mt-8 rounded-lg" onPress={handleBook}>
        <Text>Book ride</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BookingPage
