import React, { useEffect, useMemo, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Icon, Switch, Text } from "react-native-elements";

import Ionicons from "react-native-vector-icons/Ionicons";
import { openToastr } from "../../utils/Toast";
import { LoadingScreen } from "../../components/LoadingScreen";
import { useMeetUser, useNearbyLocations } from "./data/useNearbyLocations";
import debounce from "lodash.debounce";
import { useProfile } from "../Profile/data/useProfile";

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
  const [selectedUserLocation, setSelectedUserLocation] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  const [isCurrentLocation, setIsCurrentLocation] = useState(true);

  const mapRef = React.useRef(null);

  const { data: profileData } = useProfile();

  const mySavedLocation = useMemo(() => {
    if (
      profileData?.location?.coordinates?.[0] &&
      profileData?.location?.coordinates?.[1]
    ) {
      return {
        latitude: profileData?.location?.coordinates?.[1],
        longitude: profileData?.location?.coordinates?.[0],
      };
    }
  }, [
    profileData?.location?.coordinates?.[0],
    profileData?.location?.coordinates?.[1],
  ]);

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

  const setMapCenter = (latitude, longitude) => {
    setMapRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const getCenterLocation = ({
    firstLatitude,
    firstLongitude,
    secondLatitude,
    secondLongitude,
  }) => {
    const firstLatValue = firstLatitude ?? secondLatitude;
    const firstLngValue = firstLongitude ?? secondLongitude;

    const secondLatValue = secondLatitude ?? firstLatitude;
    const secondLngValue = secondLongitude ?? firstLongitude;

    return {
      latitude: (firstLatValue + secondLatValue) / 2,
      longitude: (firstLngValue + secondLngValue) / 2,
    };
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
        setMapCenter(
          user?.location?.coordinates?.[1],
          user?.location?.coordinates?.[0]
        );
      }

      exploreLocation();

      setIsMapLoading(false);
    } else {
      const location = await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const user = route.params.user;

      let centerLatitude = location.coords.latitude;
      let centerLongitude = location.coords.longitude;

      if (
        user?.location?.coordinates?.[0] &&
        user?.location?.coordinates?.[1]
      ) {
        const { latitude, longitude } = getCenterLocation({
          firstLatitude: location.coords.latitude,
          firstLongitude: location.coords.longitude,
          secondLatitude: user?.location?.coordinates?.[1],
          secondLongitude: user?.location?.coordinates?.[0],
        });
        centerLatitude = latitude;
        centerLongitude = longitude;
      }

      setSelectedUserLocation({
        latitude: user?.location?.coordinates?.[1],
        longitude: user?.location?.coordinates?.[0],
      });

      setMapCenter(centerLatitude, centerLongitude);

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

  const coordinates = [
    {
      latitude: isCurrentLocation
        ? myLocation?.latitude
        : mySavedLocation?.latitude,
      longitude: isCurrentLocation
        ? myLocation?.longitude
        : mySavedLocation?.longitude,
    },
    {
      latitude: selectedUserLocation?.latitude,
      longitude: selectedUserLocation?.longitude,
    },
  ];

  const showDirections =
    ((myLocation?.latitude && myLocation?.longitude && isCurrentLocation) ||
      (mySavedLocation?.latitude &&
        mySavedLocation?.longitude &&
        !isCurrentLocation)) &&
    selectedUserLocation?.latitude &&
    selectedUserLocation?.longitude;

  const directions = useMemo(() => {
    return (
      <>
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={"AIzaSyAduRO4qBTC1Flec9RGCqEhrvfNFwRAJTE"}
          strokeWidth={4}
          strokeColor="#111111"
        />

        <MapView.Marker
          coordinate={{
            latitude: coordinates[0].latitude,
            longitude: coordinates[0].longitude,
          }}
          title="Your Location"
        />
        <MapView.Marker
          coordinate={{
            latitude: coordinates[1].latitude,
            longitude: coordinates[1].longitude,
          }}
          title="Friend Location"
        />
      </>
    );
  }, [coordinates]);

  const switchLocation = () => {
    const { latitude, longitude } = getCenterLocation({
      firstLatitude: !isCurrentLocation
        ? myLocation?.latitude
        : mySavedLocation?.latitude,
      firstLongitude: !isCurrentLocation
        ? myLocation?.longitude
        : mySavedLocation?.longitude,
      secondLatitude: coordinates[1].latitude,
      secondLongitude: coordinates[1].longitude,
    });

    mapRef.current?.animateToRegion?.({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setIsCurrentLocation((prev) => !prev);
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
          <>
            <MapView
              ref={mapRef}
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
                  provider={PROVIDER_GOOGLE}
                />
              ))}
              {showDirections && directions}
              <MapView.Marker
                coordinate={{
                  latitude: mapRegion.latitude,
                  longitude: mapRegion.longitude,
                }}
                title="Meeting Point"
                description="Your will meet around here"
              />
            </MapView>

            <Pressable
              onPress={() => {
                setIsCurrentLocation((prev) => !prev);
              }}
              className="absolute p-2 top-3 right-3 w-48 rounded-full bg-black flex justify-center items-center"
            >
              <View className="flex flex-row gap-2 items-center">
                <Text className="text-white">
                  {isCurrentLocation ? "Current Location" : "Saved Location"}
                </Text>
                <Switch
                  trackColor={{ false: "#E64C3C", true: "#2563eb" }}
                  thumbColor={isCurrentLocation ? "#fff" : "#fff"}
                  ios_backgroundColor="#E64C3C"
                  onValueChange={switchLocation}
                  value={isCurrentLocation}
                />
              </View>
            </Pressable>
          </>
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
