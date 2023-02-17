import React from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Alert,
} from "react-native";
import Toast from "react-native-root-toast";

import { SimpleLineIcons } from "@expo/vector-icons";
import { useFollowingList, useUnFollow } from "../data/useFollowingList";

export function ListView() {
  const { data, isLoading, refetch: refetchList } = useFollowingList();

  const { mutate: doUnFollow } = useUnFollow({
    onSuccess: () => {
      Toast.show("Unfollowed Successfully", {
        duration: 3000,
        backgroundColor: "white",
        textColor: "black",
        textStyle: {
          fontSize: 12,
          color: "black",
        },
      });
      refetchList();
    },
    onError: (error) => {
      Toast.show(error?.response?.data?.message ?? "Server error", {
        duration: 3000,
        backgroundColor: "#aa2b30",
        textColor: "white",
        textStyle: {
          fontSize: 12,
        },
      });
    },
  });

  const createTwoButtonAlert = (user) =>
    Alert.alert(
      "Unfollow",
      `Are you sure you want to unfollow "${user?.name}"?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            doUnFollow({ id: user?.id });
          },
        },
      ]
    );

  return (
    <FlatList
      className="w-full h-full px-4 mt-4"
      data={(data ?? []).map((item) => ({
        ...item,
        key: item.id,
      }))}
      refreshControl={
        <RefreshControl
          isRefreshing={isLoading}
          onRefresh={refetchList}
          colors={["#000"]} // for android
          tintColor={"#000"} // for ios
        />
      }
      renderItem={({ item }) => (
        <View className="shadow-xs bg-white mb-4 px-4 py-3 rounded-lg flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View className="bg-black h-10 w-10 rounded-lg mr-3 flex items-center justify-center">
              <Text className="text-white text-lg font-bold">
                {item?.name?.slice(0, 1)?.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className=" font-bold ">{item.name}</Text>
              <Text className="text-gray-400 mb-1">{item.email}</Text>
              <Text className="text-gray-700 ">
                Distance: {!!item.distance ? item.distance + "km" : "NA"}
              </Text>
            </View>
          </View>
          <View className="flex items-center justify-center">
            <Pressable
              className="bg-white rounded-lg p-3"
              onPress={() => {
                createTwoButtonAlert(item);
              }}
              disabled={isLoading}
            >
              <Text className="text-black text-center font-bold">
                <SimpleLineIcons
                  name="user-unfollow"
                  size={20}
                  color="#df4759"
                />
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
