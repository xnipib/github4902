import React from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import Toast from "react-native-root-toast";

import { SimpleLineIcons } from "@expo/vector-icons";
import { useFollowingList, useUnFollow } from "../data/useFollowingList";
import { openToastr } from "../../../utils/Toast";
import { Input } from "react-native-elements";

export function ListView({ navigation }) {
  const { data, isLoading, refetch: refetchList } = useFollowingList();

  const [keyword, setKeyword] = React.useState("");
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const { mutate: doUnFollow } = useUnFollow({
    onSuccess: () => {
      openToastr({ message: "Unfollowed Successfully" });

      refetchList();
    },
    onError: (error) => {
      openToastr({
        message: error?.response?.data?.message ?? "Server error",
        isError: true,
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

  const onMeetPress = (user) => {
    setIsDialogVisible(true);
    setSelectedUser(user);
  };

  const navigateToMapScreen = ({ user, keyword }) => {
    navigation.navigate("MeetMap", { user, keyword });
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDialogVisible}
        onRequestClose={() => {
          setIsDialogVisible(false);
        }}
      >
        <View className="flex flex-col items-center justify-center h-full w-full bg-[#000000b1] ">
          <View className="bg-white rounded-lg p-4 w-3/4">
            <Text className="text-black text-sm leading-7  font-medium">
              Where did you meet `{selectedUser?.name}`?
            </Text>
            <Input
              value={keyword}
              onChangeText={setKeyword}
              placeholder={"Ex: Restaurant, Cafe, etc."}
            />
          </View>
          <View className="flex gap-3 flex-row items-center justify-center w-3/4 mt-4 ">
            <Pressable
              className="bg-gray-400 rounded-lg p-2 flex-1 flex flex-row items-center justify-center"
              onPress={() => {
                setIsDialogVisible(false);
              }}
            >
              <Text className="text-white text-sm leading-7  font-medium">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              className="bg-black rounded-lg p-2 flex-1 flex-row items-center justify-center"
              onPress={() => {
                navigateToMapScreen({ user: selectedUser, keyword });
                setIsDialogVisible(false);
              }}
              disabled={!keyword}
            >
              <Text className="text-white text-sm leading-7  font-medium">
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
                  Distance:{" "}
                  {!!item.distance || item.distance === 0
                    ? item.distance + "km"
                    : "NA"}
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center justify-center">
              <Pressable
                className="bg-white rounded-lg p-3"
                onPress={() => {
                  onMeetPress(item);
                }}
                disabled={isLoading}
              >
                <Text className="text-black text-center font-bold">
                  <SimpleLineIcons name="location-pin" size={20} color="#000" />
                </Text>
              </Pressable>
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
    </View>
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
