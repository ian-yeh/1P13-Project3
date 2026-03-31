import { View, StatusBar, TextInput, TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/store/useStore';
import { updateUser } from '@/api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
    const [name, setName] = useState('');
    const [passengerNumber, setPassengerNumber] = useState('');
    const [mobilityDetails, setMobilityDetails] = useState('');
    const [userId, setUserId] = useState('');

    const navigator = useNavigation();

    const handleSave = async () => {
        // console.log('Settings saved:', { name, passengerNumber, mobilityDetails, userId });

        const response = await updateUser(userId, {
            name: name,
            passenger_number: passengerNumber,
            mobility_details: mobilityDetails,
            user_id: userId
        })

        // console.log(response) // check if updating actually works
        navigator.goBack();
    }

    // load from global state temp
    useEffect(() => {
        const userData: any = useUser.getState();
        setName(userData.name);
        setPassengerNumber(userData.passengerNumber.toString());
        setMobilityDetails(userData.mobilityDetails);
        setUserId(userData.userId);
    }, []);

    return (
        <View className="flex-1 bg-[#F0F2FA]">
            {/* Header Block matching Calendar page */}
            <View className="bg-[#9676E5] pt-16 pb-6 z-10 w-full items-center">
                <Text className="text-white text-5xl font-bold mt-4">Settings</Text>
            </View>

            <View className="flex-1 px-6 pt-12 items-center">
                {/* main settings form block */}
                <View className="bg-white w-full p-6 border-2 border-[#9676E5]">

                    <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
                        value={name}
                        onChangeText={setName}
                        placeholder="John Doe"
                    />

                    <Text className="text-gray-700 font-semibold mb-2">Passenger number</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
                        value={passengerNumber}
                        onChangeText={setPassengerNumber}
                        keyboardType="phone-pad"
                        placeholder="e.g. 1"
                    />

                    <Text className="text-gray-700 font-semibold mb-2">Mobility details / companions</Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg p-3 mb-8 text-base"
                        value={mobilityDetails}
                        onChangeText={setMobilityDetails}
                        multiline
                        placeholder="Ex. wheelchair, service animal, etc."
                    />

                    <TouchableOpacity
                        className="bg-[#9676E5] w-full py-4 rounded-xl items-center"
                        onPress={handleSave}
                    >
                        <Text className="text-white text-lg font-bold">Save Changes</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}
