import { getEvents } from "@/api/api";
import { useState, useEffect } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

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
        className={`py-4 px-4 my-4 rounded-lg border justify-between`}
      >
        <View>
          <Text className="text-lg font-semibold mb-4">{location}</Text>
        </View>
        <View className="flex-1 flex-row items-center gap-8 justify-between">
          <View>
            <Text className="text-xs font-semibold mb-1 text-gray-600">Departure</Text>
            <Text className="text-sm">{departureTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-sm">{departureTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "EST" })}</Text>
          </View>
          <View>
            <Text className="text-xs font-semibold mb-1 text-gray-600">Arrival</Text>
            <Text className="text-sm">{arrivalTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
            <Text className="text-sm">{arrivalTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "EST" })}</Text>
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

  useEffect(() => {
    async function fetchData() {
      let id = "1"
      if (userId) id = userId
      const response: any[] = await getEvents(id);
      setEvents(response)
      console.log(events)
    }

    fetchData();

  }, [userId])

  return (
    <View>
      <ScrollView>
        {events.map((item, i) => (
          <View key={i}>
            <EventCard
              status={item.status || 'pending'}
              arrivalTime={new Date(item.arrival_time)}
              departureTime={new Date(item.departure_time)}
              name={item.name}
              location={item.location}
              userId={item.userId}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


