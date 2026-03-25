import { getEvents } from "@/api/api";
import { useState, useEffect, useCallback } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";

interface EventListProps {
  userId: string
}

interface EventCardProps {
  arrivalTime: Date;
  departureTime: Date;
  location: string;
  name: string;
  userId: string;
  status: string;
}

function EventCard({
  arrivalTime, departureTime, location, name, userId, status
}: EventCardProps) {

  console.log(arrivalTime, departureTime)
  console.log(status)

  return (
    <View className="py-5 px-5 my-3 bg-white rounded-xl border border-gray-200">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-gray-800">{location}</Text>
      </View>

      <View className="flex-col gap-4 w-full">
        <View className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <Text className="text-sm font-semibold mb-1 text-gray-500">Pick-up (Going to Destination)</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-semibold text-black">{departureTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-base font-semibold text-gray-700">{departureTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</Text>
          </View>
        </View>
        <View className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <Text className="text-sm font-semibold mb-1 text-gray-500">Return (Leaving Destination)</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-semibold text-black">{arrivalTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-base font-semibold text-gray-700">{arrivalTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</Text>
          </View>
        </View>
      </View>

      <Text className="text-sm font-bold mt-5 text-gray-700">Status: <Text
        className={`${status === "pending" ? "text-purple-600" : status === "cancelled" ? "text-red-500" : "text-green-600"}`}
      >{status}</Text></Text>
    </View>
  )
}

export function EventList({ userId }: EventListProps) {
  const [events, setEvents] = useState<any[]>([])

  useFocusEffect(
    // using a useCallback hook because it's required for useFocusEffect --> basically only runs when the component is in view
    useCallback(() => {
      async function fetchData() {
        if (!userId) {
          console.log("No userId provided to EventList, skipping fetch");
          return;
        }
        try {
          console.log("Fetching events for userId:", userId);
          const response: any[] = await getEvents(userId);
          console.log("Fetched events data:", response);
          setEvents(response || []);
        } catch (error) {
          console.error("Error fetching events:", error);
          setEvents([]);
        }
      }

      fetchData();
    }, [userId])
  );

  return (
    <View className="flex-1 w-full shadow-sm">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {events && events.length > 0 ? (
          events.map((item, i) => (
            <View key={i}>
              <EventCard
                status={item.status || 'pending'}
                arrivalTime={new Date(item.arrival_time || item.arrivalTime)}
                departureTime={new Date(item.departure_time || item.departureTime)}
                name={item.name}
                location={item.location}
                userId={item.userId || item.user_id}
              />
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-10">No events found.</Text>
        )}
      </ScrollView>
    </View>
  );
}


