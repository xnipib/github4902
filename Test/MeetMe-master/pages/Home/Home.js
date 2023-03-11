import * as React from "react";

import { View, Text, SafeAreaView, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { LoadingScreen } from "../../components/LoadingScreen";
import { ListView } from "./components/ListView";
import { UsersMap } from "./components/UsersMap";
import { useFollowingList } from "./data/useFollowingList";

export function HomeScreen({ navigation }) {
  const [view, setView] = React.useState("list");
  const { data, isLoading } = useFollowingList();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const currentView =
    view === "list" ? <ListView navigation={navigation} /> : <UsersMap />;

  const viewIcons = (icon) => (
    <View
      className={`p-1 rounded-full ${view == icon ? "bg-black" : "bg-white"}`}
    >
      <Ionicons
        name={view == icon ? icon : `${icon}-outline`}
        size={20}
        color={view == icon ? "white" : "black"}
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-gray-50">
      <View className="pb-20">
        <View className="relative">
          <Text className="text-black text-center text-2xl font-bold mb-2">
            Following
          </Text>
          <View className="px-6 flex items-end">
            <Pressable
              onPress={() => setView(view === "list" ? "map" : "list")}
            >
              <View className="flex flex-row gap-2 ">
                {viewIcons("list")}
                {viewIcons("map")}
              </View>
            </Pressable>
          </View>
        </View>
        {data?.length > 0 ? (
          <View>{currentView}</View>
        ) : (
          <View className="flex h-full mt-12 ">
            <Text className="text-gray-600 text-center text-lg">
              You don't follow anyone.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
