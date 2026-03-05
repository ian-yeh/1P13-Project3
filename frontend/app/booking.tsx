import { useUser } from "@/store/useStore"
import { View, Text, TextInput } from "react-native"

const BookingPage = () => {
  const userData: any = useUser.getState();
  console.log(userData.name)

  return (
    <View className="bg-white h-full px-4 py-8">
      <Text className="text-black font-bold text-3xl">Book your ride, {userData.name}.</Text>
      <TextInput/>
    </View>
  )
}

export default BookingPage
