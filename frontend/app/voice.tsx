import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { parseVoiceCommand } from "@/utils/voice-action";
import { scheduleEvent } from "@/api/api";
import { router } from "expo-router";

// this is the info that is required to run a schedule
interface ScheduleEvent {
    name: string;
    date: Date;
    location: string;
    arrival_time: Date | null;
    departure_time: Date | null;
    user_id: string;
    status: string;
}

const VoicePage = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const [eventData, setEventData] = useState<ScheduleEvent | null>(null);
    const [success, setSuccess] = useState(false);

    useSpeechRecognitionEvent("result", (event) => {
        setTranscript(event.results[0]?.transcript ?? "");
    });

    useSpeechRecognitionEvent("end", () => {
        setIsListening(false);

        const eventData = parseVoiceCommand(transcript); // parsing keywords from voice command
        setEventData(eventData);
        console.log("event data:\n", JSON.stringify(eventData, null, 2));

    });

    useSpeechRecognitionEvent("error", (event) => {
        console.log("Speech error:", event.error);
        setIsListening(false);
    });

    const handleSpeak = async () => {
        if (isListening) {
            ExpoSpeechRecognitionModule.stop();
            return;
        }

        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.log("speech recognition permission denied");
            return;
        }

        const audioResult = await ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync();
        if (!audioResult.granted) {
            console.log("microphone permission denied");
            return;
        }

        setTranscript("");
        setIsListening(true);
        ExpoSpeechRecognitionModule.start({
            lang: "en-US",
            interimResults: true,
        });
    };


    const handleSchedule = async () => {
        if (!eventData) {
            console.log("No event data provided to handleSchedule");
            return;
        }
        const response = await scheduleEvent(eventData);
        if (response.message === "Event created successfully") {
            setSuccess(true);
        }
        console.log("Event scheduled:", response);
    }

    return (
        <View className="flex-1 bg-[#9676E5]">
            <View className="mt-10 flex-1 bg-[#9676E5] items-center">

                <View className="bg-[#9676E5] items-center mb-10">
                    {/* microphone button for voice - press to start */}
                    <TouchableOpacity
                        onPress={handleSpeak}
                        className={`w-48 h-48 rounded-full items-center justify-center ${isListening ? 'bg-red-400' : 'bg-[#CDD3EF]'}`}
                    >
                        <FontAwesome name="microphone" size={80} color="#453B5F" />
                    </TouchableOpacity>
                </View>

                <View className="w-[350px] bg-white rounded-2xl p-6 mb-10">
                    <Text className="text-lg font-bold text-[#453B5F] mb-3">
                        {isListening ? "Listening..." : "Transcript"}
                    </Text>
                    <ScrollView className="max-h-[200px]">
                        <Text className="text-base text-[#453B5F]">
                            {transcript}
                        </Text>
                    </ScrollView>
                </View>

                <View className="w-[350px] bg-white rounded-2xl p-6 mb-10">
                    <Text className="text-xl font-bold text-[#453B5F] mb-4">Confirm Ride Details</Text>

                    <View>
                        <Text className="text-lg text-gray-500 mb-4">
                            {eventData ? "Scheduled for " + eventData?.date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : "Schedule a ride!"}
                        </Text>
                        <Text className="text-base text-[#453B5F]">
                            <Text className="font-bold">Destination:</Text> {eventData?.location || ""}
                        </Text>
                        <Text className="text-base text-[#453B5F] mt-2">
                            <Text className="font-bold">Pick-up:</Text> {eventData?.departure_time?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || ""}
                        </Text>
                        <Text className="text-base text-[#453B5F] mt-2">
                            <Text className="font-bold">Return:</Text> {eventData?.arrival_time?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || ""}
                        </Text>
                    </View>
                </View>

                {eventData && (
                    <TouchableOpacity
                        onPress={handleSchedule}
                        className="bg-[#CDD3EF] py-3.5 px-8 rounded-lg items-center justify-center"
                    >
                        <Text className="text-base font-bold text-[#453B5F]">Schedule Ride</Text>
                    </TouchableOpacity>
                )}

                {success && (
                    <View className="w-full px-8 mt-4">
                        <Text className="text-lg font-bold text-green-400 mb-3">Event scheduled successfully!</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/")}
                            className="w-full"
                        >
                            <Text className="underline text-base font-bold text-white">Go back to home</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </View>
    );
};

export default VoicePage;