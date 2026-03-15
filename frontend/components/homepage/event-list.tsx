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
    <View>
      <View
        className={`py-4 px-4 my-4 rounded-lg border justify-between border-gray-300`}
      >
        <View>
          <Text className="text-lg font-semibold mb-4">{location}</Text>
        </View>
        <View className="flex-1 flex-row items-center grid grid-cols-2 gap-8 w-full">
          <View>
            <Text className="text-sm font-semibold mb-1 text-gray-600">Departure</Text>
            <Text className="text-lg">{departureTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-lg">{departureTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "EST" })}</Text>
          </View>
          <View>
            <Text className="text-sm font-semibold mb-1 text-gray-600">Arrival</Text>
            <Text className="text-lg">{arrivalTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-lg">{arrivalTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "EST" })}</Text>
          </View>
        </View>
        <Text className="text-sm font-semibold mt-4">Status: <Text
          className={`${status === "pending" ? "text-purple-400" : status === "cancelled" ? "text-red-400" : "text-green-400"}`}
        >{status}</Text></Text>
      </View>
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
    <View className="flex-1 w-full">
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


