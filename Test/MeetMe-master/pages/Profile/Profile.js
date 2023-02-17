import * as React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import Ionicons from "react-native-vector-icons/Ionicons";

import * as ImagePicker from "expo-image-picker";

import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  Switch,
  RefreshControl,
  ScrollView,
  Button,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../Auth/auth";
import { LoadingScreen } from "../../components/LoadingScreen";

import {
  useProfile,
  useToggleVisibility,
  useUpdateLocation,
  useUpdateProfile,
} from "./data/useProfile";
import { Divider, Image } from "react-native-elements";
import { useQueryClient } from "@tanstack/react-query";
import { UserLocation } from "./components/UserLocation";

export function ProfileScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isUpdateLocation, setIsUpdateLocation] = React.useState(false);

  const { mutate: updateProfile, isLoading: isUpdateImageLoading } =
    useUpdateProfile();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.uri || "";
      const filename = localUri?.split("/")?.pop();
      const fileType = localUri?.split(".")?.pop();

      const formData = new FormData();
      formData.append("photo", {
        uri: localUri,
        name: filename,
        type: `image/${fileType}`,
      });

      updateProfile(formData, {
        onSuccess: () => {
          Toast.show("Photo updated Successfully", {
            duration: 3000,
            backgroundColor: "white",
            textColor: "black",
            textStyle: {
              fontSize: 12,
              color: "black",
            },
          });

          refetchProfile();
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
    }
  };

  const { signOut } = useAuth();

  const { data: userData, isLoading, refetch: refetchProfile } = useProfile();

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

  const queryClient = useQueryClient();

  const removeCachedData = () => {
    queryClient.removeQueries();
    queryClient.invalidateQueries();
  };

  const profilePhoto = isUpdateImageLoading ? (
    <View className="h-20 w-20 flex justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  ) : userData?.photo ? (
    <Image
      className="w-20 h-20 border-2 border-gray-400 rounded-full"
      source={{
        uri: userData?.photo,
      }}
    />
  ) : (
    <LettersAvatar userData={userData} />
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isUpdateLocation) {
    return <UserLocation setIsUpdateLocation={setIsUpdateLocation} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView
        refreshControl={
          <RefreshControl
            isRefreshing={isLoading}
            onRefresh={() => {
              refetchProfile();
            }}
            colors={["#000"]}
            tintColor={"#000"}
          />
        }
      >
        <View>
          <View className="flex items-center justify-center text-center">
            <View className="relative w-full">
              <Text className="text-black text-center text-2xl font-bold mb-2">
                Profile
              </Text>
            </View>

            <View className="relative ">
              {profilePhoto}

              <Pressable
                onPress={() => {
                  pickImage();
                }}
                className="absolute top-2 -right-2 rounded-full bg-white p-1 border border-gray-400"
              >
                <View>
                  <Ionicons name="pencil" size={16} color="black" />
                </View>
              </Pressable>
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
                setIsUpdateLocation(true);
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
                <Text
                  className={`text-lg ml-4 font-semibold text-gray-800 mr-2`}
                >
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
                <Text
                  className={`text-lg ml-4 font-semibold text-gray-800 mr-2`}
                >
                  Logout
                </Text>
              </View>
            </Pressable>
          </SettingRow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LettersAvatar({ userData }) {
  return (
    <View className="bg-black h-20 w-20 rounded-full flex items-center justify-center text-center ">
      <Text className="text-white text-xl font-bold">
        {userData?.name?.slice(0, 2)?.toUpperCase()}
      </Text>
    </View>
  );
}

function SettingRow({ children }) {
  return (
    <View className="flex justify-between items-center flex-row px-8 mb-6">
      {children}
    </View>
  );
}
