import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { useFollowingList } from "../data/useFollowingList";

export function UsersMap() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 54.526,
    longitude: 15.2551,
    latitudeDelta: 50,
    longitudeDelta: 100,
  });

  const { data } = useFollowingList();

  const markers = data
    ?.filter((u) => !!u.location)
    ?.map((user) => ({
      latitude: user?.location?.coordinates?.[1],
      longitude: user?.location?.coordinates?.[0],
      title: user?.name,
      description: user?.email,
    }));

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={mapRegion} showsUserLocation>
        {markers?.map((marker, index) => (
          <MapView.Marker
            key={index}
            coordinate={marker}
            title={marker.title}
            description={marker.description}
            image={require("../../../assets/marker.png")}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
