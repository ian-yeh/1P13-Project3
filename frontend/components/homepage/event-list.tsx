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
}

function EventCard({
  arrivalTime, departureTime, location, name, userId
}: EventCardProps) {

  console.log(arrivalTime,departureTime)

  return (
    <View>
      <View style={styles.cardContainer}>
        <View>
          <Text style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{location}</Text>
          <Text style={{ fontSize: 11, color: "#666" }}>Rider: {name}</Text>
        </View>
        <View style={{ }}>
          <Text style={{ fontSize: 10 }}>Departure {departureTime.toDateString()}</Text>
          <Text style={{ fontSize: 10 }}>Arrival: {arrivalTime.toDateString()}</Text>
        </View>
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



const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fcfbfc',
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 8,
    padding: 8,
    borderColor: '#eeeef5',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
})
