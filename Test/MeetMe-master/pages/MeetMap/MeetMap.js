import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Text } from "react-native-elements";

import Ionicons from "react-native-vector-icons/Ionicons";
import { openToastr } from "../../utils/Toast";
import { LoadingScreen } from "../../components/LoadingScreen";
import { useMeetUser, useNearbyLocations } from "./data/useNearbyLocations";
import debounce from "lodash.debounce";

const initialRegion = {
  latitude: 54.526,
  longitude: 15.2551,
  latitudeDelta: 50,
  longitudeDelta: 100,
};

export function MeetMapScreen({ navigation, route }) {
  const [mapRegion, setMapRegion] = useState(initialRegion);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedMeetPoint, setSelectedMeetPoint] = useState(null);

  const {
    data: regionLocations,
    isLoading: isLoadingLocations,
    refetch: refetchLocations,
  } = useNearbyLocations({
    latitude: mapRegion.latitude,
    longitude: mapRegion.longitude,
    keyword: route.params?.keyword ?? "",
  });

  const exploreLocation = () => {
    const debouncedFilter = debounce(() => {
      refetchLocations({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        keyword: route.params?.keyword ?? "",
      });
    }, 500);

    debouncedFilter();
  };

  const getCurrentPosition = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      openToastr({
        message: "Permission to access location was denied",
      });

      if (
        user?.location?.coordinates?.[0] &&
        user?.location?.coordinates?.[1]
      ) {
        setMapRegion({
          latitude: user?.location?.coordinates?.[1],
          longitude: user?.location?.coordinates?.[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      exploreLocation();

      setIsMapLoading(false);
    } else {
      const location = await Location.getCurrentPositionAsync({});

      const user = route.params.user;

      let centerLatitude = location.coords.latitude;
      let centerLongitude = location.coords.longitude;

      if (
        user?.location?.coordinates?.[0] &&
        user?.location?.coordinates?.[1]
      ) {
        centerLatitude =
          (location.coords.latitude + user?.location?.coordinates?.[1]) / 2;
        centerLongitude =
          (location.coords.longitude + user?.location?.coordinates?.[0]) / 2;
      }

      setMapRegion({
        latitude: centerLatitude,
        longitude: centerLongitude,
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
    exploreLocation();
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const { mutate: doMeetUser } = useMeetUser({
    onSuccess: () => {
      openToastr({ message: "Marked as visited" });
      navigation.navigate("Home");
    },
    onError: (error) => {
      openToastr({
        message: error?.response?.data?.message ?? "Server error",
        isError: true,
      });
    },
  });

  const onSelectMeetPoint = () => {
    if (!!selectedMeetPoint && !!route.params?.user) {
      doMeetUser({
        user: route.params?.user,
        location: selectedMeetPoint?.location,
        address: selectedMeetPoint?.address,
        name: selectedMeetPoint?.name,
        photo_url: selectedMeetPoint?.photo_url,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="relative w-full mt-2 mb-1">
        <Text className="text-black text-center text-2xl font-bold ">
          Select Meet Location
        </Text>
        <Pressable
          onPress={() => navigation.navigate("Home")}
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
            showsPointsOfInterest={false}
          >
            {regionLocations?.map((marker, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: marker.location.latitude,
                  longitude: marker.location.longitude,
                }}
                title={marker.name}
                description={"Rating:" + marker.rating}
                image={require("../../assets/placeMarker.png")}
                onPress={() => {
                  setSelectedMeetPoint(marker);
                }}
              />
            ))}
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

        {!!selectedMeetPoint && (
          <Pressable
            onPress={onSelectMeetPoint}
            className="absolute p-3 bottom-10 right-10 left-10 rounded-full bg-black flex justify-center items-center"
          >
            <View>
              <Text className="text-white">
                {isLoadingLocations ? (
                  <ActivityIndicator size="small" />
                ) : (
                  "Mark as visited"
                )}
              </Text>
            </View>
          </Pressable>
        )}
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
