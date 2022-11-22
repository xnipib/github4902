import * as React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

import * as Location from "expo-location";

import { Text, SafeAreaView, Pressable, View, Switch } from "react-native";
import { useAuth } from "../../Auth/auth";
import { LoadingScreen } from "../../components/LoadingScreen";

import {
  useProfile,
  useToggleVisibility,
  useUpdateLocation,
} from "./data/useProfile";
import { Divider } from "react-native-elements";
import { useQueryClient } from "@tanstack/react-query";

export function ProfileScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const { signOut } = useAuth();

  const { data: userData, isLoading } = useProfile();

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

  React.useEffect(() => {
    if (userData?.location_visible) {
      setIsEnabled(true);
    }
  }, [userData]);

  const { mutate: doChangeVisibility } = useToggleVisibility();

  const toggleSwitch = (value) => {
    setIsEnabled(value);
    doChangeVisibility(value);
  };

  const updateLocation = async () => {
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
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    doUpdateLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const queryClient = useQueryClient();

  const removeCachedData = () => {
    queryClient.removeQueries();
    queryClient.invalidateQueries();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <View>
        <View className="flex items-center justify-center text-center">
          <Text className="text-black text-center text-2xl font-bold mb-2">
            Profile
          </Text>

          <View className="bg-black h-20 w-20 rounded-[36px] flex items-center justify-center text-center mt-4 mb-3">
            <Text className="text-white text-xl font-bold">
              {userData?.name?.slice(0, 2)?.toUpperCase()}
            </Text>
          </View>
          <View className="flex items-center justify-center text-center">
            <Text className="text-black text-xl font-medium">
              {userData?.name}
            </Text>
            <Text className="text-md font-medium mb-4 text-gray-500">
              {userData?.email}
            </Text>
          </View>
        </View>
        <View className="px-16 my-1">
          <Divider style={{ backgroundColor: "#a2a2a2", height: 2 }} />
        </View>
      </View>
      <View className="mt-6">
        <SettingRow>
          <View className="flex flex-row items-center">
            <View className="bg-blue-600 p-2.5 rounded-lg">
              <SimpleLineIcons name={"eye"} size={22} color={"white"} />
            </View>
            <Text
              className={`text-lg ml-4 font-semibold ${
                isEnabled ? "text-gray-800" : "text-gray-500"
              } mr-2`}
            >
              Visibility
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#a2a2a2", true: "#2563eb" }}
            thumbColor={isEnabled ? "#fff" : "#fff"}
            ios_backgroundColor="#a2a2a2"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </SettingRow>
        <SettingRow>
          <Pressable
            className="w-full"
            onPress={() => {
              updateLocation();
            }}
          >
            <View className="flex flex-row items-center">
              <View className="bg-green-600 p-2.5 rounded-lg">
                <SimpleLineIcons
                  name={"location-pin"}
                  size={22}
                  color={"white"}
                />
              </View>
              <Text className={`text-lg ml-4 font-semibold text-gray-800 mr-2`}>
                Update Location
              </Text>
            </View>
          </Pressable>
        </SettingRow>
        <SettingRow>
          <Pressable
            className="w-full"
            onPress={() => {
              removeCachedData();
              signOut();
            }}
          >
            <View className="flex flex-row items-center">
              <View className="bg-gray-600 p-2.5 rounded-lg">
                <SimpleLineIcons name={"logout"} size={22} color={"white"} />
              </View>
              <Text className={`text-lg ml-4 font-semibold text-gray-800 mr-2`}>
                Logout
              </Text>
            </View>
          </Pressable>
        </SettingRow>
      </View>
    </SafeAreaView>
  );
}

function SettingRow({ children }) {
  return (
    <View className="flex justify-between items-center flex-row px-8 mb-6">
      {children}
    </View>
  );
}
