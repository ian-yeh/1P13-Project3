import { useUser } from "@/store/useStore";
import { Text, View } from "react-native";

interface EventListProps {
  userId: string
}

export function EventList({ userId }: EventListProps) {
 
  return (
    <View>
      <Text>{userId}</Text>
    </View>
  );
}

