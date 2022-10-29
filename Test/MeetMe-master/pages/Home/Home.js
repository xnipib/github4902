import * as React from "react";

import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

import { useUnFollow, useFollowingList } from "./data/useFollowingList";
import { LoadingScreen } from "../../components/LoadingScreen";

export function HomeScreen({ navigation }) {
  const { data, isLoading, refetch: refetchList } = useFollowingList();

  const { mutate: doUnFollow } = useUnFollow({
    onSuccess: () => {
      Toast.show("unfollowed Successfully", {
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="bg-gray-50">
      <View className="pb-20">
        <View>
          <Text className="text-black text-center text-2xl font-bold mb-2">
            Following
          </Text>
        </View>
        {data?.length > 0 ? (
          <FlatList
            className="w-full h-full px-4 mt-4"
            data={(data ?? []).map((item) => ({
              ...item,
              key: item.id,
            }))}
            renderItem={({ item }) => (
              <View className="shadow-xs bg-white mb-4 px-4 py-3 rounded-lg flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <View className="bg-black h-10 w-10 rounded-lg mr-3 flex items-center justify-center">
                    <Text className="text-white text-lg font-bold">
                      {item?.name?.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className=" font-bold ">{item.name}</Text>
                    <Text className="text-gray-400 ">{item.email}</Text>
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
