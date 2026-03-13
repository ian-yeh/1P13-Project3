import { useUser } from "@/store/useStore"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { scheduleEvent } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";


const BookingPage = () => {
  const navigator = useNavigation();
  const userData: any = useUser.getState();

  const [location, setLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null)
  const [departureTime, setDepartureTime] = useState<Date | null>(null)
  const [showDeparturePicker, setShowDeparturePicker] = useState(false)
  const [showArrivalPicker, setShowArrivalPicker] = useState(false)

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
    <View className="flex-1 items-center pt-[90px]" style={{ backgroundColor: '#9676E5' }}>
      <View className="bg-white rounded-2xl p-6 w-[350px] border" style={{ borderColor: '#9676E5' }}>
        <Text className="font-bold text-3xl mb-2">Book your ride, {userData.name}.</Text>

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
          <Text className="mt-4 text-base font-semibold" style={{ color: '#453B5F' }}>Departure Time</Text>

          <TouchableOpacity
            className="border rounded-lg p-3 mt-1.5"
            onPress={() => setShowDeparturePicker(true)}
          >
            <Text style={{ color: departureTime ? '#453B5F' : '#9676E5' }}>{departureTime ? departureTime.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Select date"}</Text>
          </TouchableOpacity>

          {showDeparturePicker && (
            <DateTimePicker
              value={departureTime ?? new Date()}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDeparturePicker(false)
                if (selectedDate) setDepartureTime(selectedDate)
              }}
            />
          )}
        </View>

        <View>
          <Text className="mt-4 text-base font-semibold" style={{ color: '#453B5F' }}>Arrival Time</Text>

          <TouchableOpacity
            className="border rounded-lg p-3 mt-1.5"
            onPress={() => setShowArrivalPicker(true)}
          >
            <Text style={{ color: arrivalTime ? '#453B5F' : '#9676E5' }}>{arrivalTime ? arrivalTime.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Select date"}</Text>
          </TouchableOpacity>

          {showArrivalPicker && (
            <DateTimePicker
              value={arrivalTime ?? new Date()}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowArrivalPicker(false)
                if (selectedDate) setArrivalTime(selectedDate)
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
