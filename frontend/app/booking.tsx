import { useUser } from "@/store/useStore"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { scheduleEvent } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef } from "react";
import { DatePicker } from "@s77rt/react-native-date-picker";
import type { DatePickerHandle } from "@s77rt/react-native-date-picker";


const BookingPage = () => {
  const departurePickerRef = useRef<DatePickerHandle>(null);
  const arrivalPickerRef = useRef<DatePickerHandle>(null);
  const navigator = useNavigation();
  const userData: any = useUser.getState();

  const [location, setLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null)
  const [departureTime, setDepartureTime] = useState<Date | null>(null)

  const handleBook = async () => {
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
    <View className="bg-white h-full px-4 py-8 flex-1 items-center">
      <View className="max-w-[400px]">
        <Text className="text-black font-bold text-3xl">Book your ride, {userData.name}.</Text>

        <View>
          <Text className="mt-4 text-lg font-semibold">Enter Destination</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            className="border-2 border-gray-200 p-2 mt-1 rounded-lg"
          />
        </View>

        <View>
          <Text className="mt-4 font-semibold text-lg">Departure Time</Text>

          <TouchableOpacity
            className="border-2 border-gray-200 p-2 mt-1 rounded-lg"
            onPress={() => departurePickerRef.current?.showPicker()}
          >
            <Text>{departureTime ? departureTime.toString() : "Select date"}</Text>
          </TouchableOpacity>

          <DatePicker
            ref={departurePickerRef}
            type="datetime"
            value={departureTime}
            onChange={setDepartureTime}
          />
        </View>

        <View>
          <Text className="mt-4 font-semibold text-lg">Arrival Time</Text>

          <TouchableOpacity
            className="border-2 border-gray-200 p-2 mt-1 rounded-lg"
            onPress={() => arrivalPickerRef.current?.showPicker()}
          >
            <Text>{arrivalTime ? arrivalTime.toString() : "Select date"}</Text>
          </TouchableOpacity>

          <DatePicker
            ref={arrivalPickerRef}
            type="datetime"
            value={arrivalTime}
            onChange={setArrivalTime}
          />
        </View>

        <View className="flex-1 items-center">
          <TouchableOpacity className="flex items-center p-2 bg-blue-200 w-36 mt-8 rounded-lg" onPress={handleBook}>
            <Text>Book ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BookingPage
