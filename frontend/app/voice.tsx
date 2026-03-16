import { TouchableOpacity, View, Text, ScrollView } from "react-native";
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
            <View className="mt-[90px] flex-1 bg-[#9676E5] items-center">

                <View className="bg-[#9676E5] items-center mb-8">
                    <Text className="text-white text-3xl font-bold mb-8">Voice Assistant</Text>
                    <TouchableOpacity
                        onPress={handleSpeak}
                        className="bg-[#CDD3EF] py-3.5 px-8 rounded-lg items-center justify-center"
                    >
                        <Text className="text-base font-bold text-[#453B5F]">Press to start speaking</Text>
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
                    <Text className="text-lg font-bold text-[#453B5F] mb-3">Event Data:</Text>
                    <Text className="text-base text-[#453B5F]">Name: {eventData?.name}</Text>
                    <Text className="text-base text-[#453B5F]">Date: {eventData?.date.toDateString()}</Text>
                    <Text className="text-base text-[#453B5F]">Location: {eventData?.location}</Text>
                    <Text className="text-base text-[#453B5F]">Arrival Time: {eventData?.arrival_time?.toLocaleTimeString()}</Text>
                    <Text className="text-base text-[#453B5F]">Departure Time: {eventData?.departure_time?.toLocaleTimeString()}</Text>
                    <Text className="text-base text-[#453B5F]">User ID: {eventData?.user_id}</Text>
                    <Text className="text-base text-[#453B5F]">Status: {eventData?.status}</Text>
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