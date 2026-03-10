import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

const VoicePage = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    useSpeechRecognitionEvent("result", (event) => {
        setTranscript(event.results[0]?.transcript ?? "");
    });

    useSpeechRecognitionEvent("end", () => {
        setIsListening(false);
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.log("Speech error:", event.error);
        setIsListening(false);
    });

    const handleSchedule = async () => {
        if (isListening) {
            ExpoSpeechRecognitionModule.stop();
            return;
        }

        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.log("Speech recognition permission denied");
            return;
        }

        const audioResult = await ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync();
        if (!audioResult.granted) {
            console.log("Microphone permission denied");
            return;
        }

        setTranscript("");
        setIsListening(true);
        ExpoSpeechRecognitionModule.start({
            lang: "en-US",
            interimResults: true,
        });
    };

    return (
        <View className="flex-1 bg-[#9676E5]">
            <View className="mt-[90px] flex-1 bg-[#9676E5] justify-center items-center">
                <View className="flex-1 bg-[#9676E5] items-center">
                    <Text className="text-white text-3xl font-bold mb-8" style={{ fontFamily: "Rounded" }}>Voice Assistant</Text>
                    <TouchableOpacity
                        onPress={handleSchedule}
                        className="bg-[#CDD3EF] py-3.5 px-8 rounded-lg items-center justify-center"
                    >
                        <Text className="text-base font-bold text-[#453B5F]">Schedule Ride</Text>
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
            </View>
        </View>
    );
};

export default VoicePage;