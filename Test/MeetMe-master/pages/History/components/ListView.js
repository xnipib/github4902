import React from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  Linking,
} from "react-native";
import { Image } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";

import { useVisitedPlaces } from "../data/useVisitedPlaces";
import { openToastr } from "../../../utils/Toast";

export function ListView({ navigation }) {
  const { data, isLoading, refetch: refetchList } = useVisitedPlaces();

  const navigateToGoogleMaps = ({ place }) => {
    if (place.latitude && place.longitude) {
      const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
      });
      const lat = place.latitude;
      const lng = place.longitude;

      const latLng = `${lat},${lng}`;
      const label = place.name;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    } else {
      openToastr({
        message: "Location longitude and latitude is not provided",
        isError: true,
      });
    }
  };

  return (
    <View>
      <FlatList
        className="w-full h-full px-4 mt-4 "
        contentContainerStyle={{ paddingBottom: 100 }}
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
            <View className="flex flex-row items-center flex-1">
              <View className="bg-black h-10 w-10 rounded-lg mr-3 flex items-center justify-center">
                {item?.place?.photo_url ? (
                  <Image
                    className="h-10 w-10 rounded-lg"
                    source={{ uri: item?.place?.photo_url }}
                  />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    {item?.place?.photo_url?.slice(0, 1)?.toUpperCase()}
                  </Text>
                )}
              </View>
              <View>
                <Text className=" font-bold ">{item.place.name || "NA"}</Text>
                <Text className="text-gray-400 mb-1">
                  {item.place.address || "NA"}
                </Text>
                <Text className="text-gray-700 ">
                  Visited With: {item?.visited_with?.name || "NA"}
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center justify-center ">
              <Pressable
                className="bg-white rounded-lg p-3"
                onPress={() => {
                  navigateToGoogleMaps(item);
                }}
                disabled={isLoading}
              >
                <Text className="text-black text-center font-bold">
                  <SimpleLineIcons name="location-pin" size={20} color="#000" />
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      {data?.length === 0 ? (
        <View className="flex h-full mt-12 ">
          <Text className="text-gray-600 text-center text-lg">
            You have no visited places yet
          </Text>
        </View>
      ) : null}
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
