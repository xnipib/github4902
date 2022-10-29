import * as React from "react";

import { Text, SafeAreaView, Pressable } from "react-native";
import { useAuth } from "../../Auth/auth";

export function ProfileScreen({ navigation }) {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 flex items-center justify-center">
      <Pressable
        className="bg-white rounded-lg p-3"
        onPress={() => {
          signOut();
        }}
      >
        <Text className="text-black text-center font-bold">Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}
