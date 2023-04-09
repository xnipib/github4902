import * as React from "react";

import { View, Text, SafeAreaView } from "react-native";

import { LoadingScreen } from "../../components/LoadingScreen";
import { ListView } from "./components/ListView";
import { useVisitedPlaces } from "./data/useVisitedPlaces";

export function HistoryScreen({ navigation }) {
  const { data, isLoading } = useVisitedPlaces();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="bg-gray-50">
      <View className="pb-20">
        <View className="relative">
          <Text className="text-black text-center text-2xl font-bold mb-2">
            Visited Places
          </Text>
        </View>

        <View>
          <ListView navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
