import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";
import MapView from "react-native-maps";
import { useProfile, useUpdateLocation } from "../data/useProfile";
import * as Location from "expo-location";
import { Text } from "react-native-elements";
import Toast from "react-native-root-toast";
import { LoadingScreen } from "../../../components/LoadingScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const initialRegion = {
  latitude: 54.526,
  longitude: 15.2551,
  latitudeDelta: 50,
  longitudeDelta: 100,
};

export function UserLocation({ setIsUpdateLocation }) {
  const [mapRegion, setMapRegion] = useState(initialRegion);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const { data: profileData, refetch: refetchProfile } = useProfile();

  const { mutate: doUpdateLocation } = useUpdateLocation({
    onSuccess: () => {
      Toast.show("Location updated Successfully", {
        duration: 3000,
        backgroundColor: "white",
        textColor: "black",
        textStyle: {
          fontSize: 12,
          color: "black",
        },
      });

      refetchProfile();

      setIsUpdateLocation(false);
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

  const updateLocation = () => {
    doUpdateLocation({
      lat: mapRegion.latitude,
      lng: mapRegion.longitude,
    });
  };

  const getCurrentPosition = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Toast.show("Permission to access location was denied", {
        duration: 3000,
        backgroundColor: "#aa2b30",
        textColor: "white",
        textStyle: {
          fontSize: 12,
        },
      });

      setIsMapLoading(false);
    } else {
      const location = await Location.getCurrentPositionAsync({});

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setIsMapLoading(false);
    }
  };

  const onRegionChange = (region) => {
    const location = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setMapRegion(location);
  };

  useEffect(() => {
    if (
      !profileData?.location?.coordinates?.[0] ||
      !profileData?.location?.coordinates?.[1]
    ) {
      getCurrentPosition();
    } else {
      setMapRegion({
        latitude: profileData.location.coordinates[1],
        longitude: profileData.location.coordinates[0],
        latitudeDelta: 0.922,
        longitudeDelta: 0.421,
      });
      setIsMapLoading(false);
    }
  }, [profileData]);

  return (
    <SafeAreaView style={styles.container}>
      <View className="relative w-full mt-2 mb-1">
        <Text className="text-black text-center text-2xl font-bold ">
          Update Location
        </Text>
        <Pressable
          onPress={() => setIsUpdateLocation(false)}
          className="absolute top-0 left-0 px-4"
        >
          <View>
            <Text className="text-black text-2xl">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Text>
          </View>
        </Pressable>
      </View>
      <View className="flex-1 mt-3 relative" style={styles.map}>
        {isMapLoading ? (
          <LoadingScreen />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={mapRegion}
            onRegionChange={onRegionChange}
            showsUserLocation
          >
            <MapView.Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="You are here"
              description="Your current location"
            />
          </MapView>
        )}
        <Pressable
          onPress={updateLocation}
          className="absolute p-3 bottom-10 right-10 left-10 rounded-full bg-black flex justify-center items-center"
        >
          <View>
            <Text className="text-white">Update Location</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
});
