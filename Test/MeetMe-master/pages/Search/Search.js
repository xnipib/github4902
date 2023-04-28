import React, { useState, useCallback } from "react";
import { Pressable } from "react-native";
import debounce from "lodash.debounce";

// import all the components we are going to use
import { SafeAreaView, Text, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useSearchUsers } from "./data/useUsersSearch";
import { useFollow } from "../Home/data/useFollowingList";
import Toast from "react-native-root-toast";
import { useQueryClient } from "@tanstack/react-query";
import { openToastr } from "../../utils/Toast";

const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const { data, refetch: refetchUsers } = useSearchUsers(search);

  const queryClient = useQueryClient();

  const { mutate: doFollow } = useFollow({
    onSuccess: () => {
      openToastr({ message: "Followed Successfully" });
      refetchUsers(search);

      queryClient.invalidateQueries(["following"]);
    },
    onError: (error) => {
      openToastr({
        message: error?.response?.data?.message ?? "Server error",
        isError: true,
      });
    },
  });

  const searchFilterFunction = useCallback((text) => {
    setSearch(text);

    const debouncedFilter = debounce(() => {
      refetchUsers(text);
    }, 500);

    debouncedFilter();
  }, []);

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  //   const getItem = (item) => {
  //     // Function for click on an item
  //     alert("Id : " + item.id + " Title : " + item.title);
  //   };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white">
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          className="search-bar"
          value={search}
          onChangeText={searchFilterFunction}
          onClear={(text) => searchFilterFunction("")}
          placeholder="Search..."
          containerStyle={{
            backgroundColor: "white",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
            padding: 16,
          }}
          inputContainerStyle={{
            backgroundColor: "#f4f5fc",
            paddingHorizontal: 8,
          }}
        />

        {(data || [])?.length > 0 ? (
          <FlatList
            className="w-full h-full px-4 mt-4"
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={({ item }) => (
              <View className="shadow-xs bg-white mb-4 px-4 py-3 rounded-lg flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <View className="bg-black h-10 w-10 rounded-lg mr-3 flex items-center justify-center">
                    <Text className="text-white text-lg font-bold">
                      {item?.name?.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className=" font-bold ">
                      {item.name?.slice(0, 10)}
                    </Text>
                    <Text className="text-gray-400 mb-1">
                      {item.email?.slice(0, 40)}
                    </Text>
                    <Text className="text-gray-700 ">
                      Distance:{" "}
                      {!!item.distance || item.distance === 0
                        ? item.distance + " Mi"
                        : "NA"}
                    </Text>
                  </View>
                </View>
                <View className="flex items-center justify-center">
                  <Pressable
                    className="bg-white rounded-lg p-3"
                    onPress={() => {
                      doFollow({ id: item.id });
                    }}
                    disabled={item.followed}
                  >
                    <Text className="text-black text-center font-bold">
                      <SimpleLineIcons
                        name={item?.followed ? "user-following" : "user-follow"}
                        size={20}
                        color={item?.followed ? "#5cb85c" : "black"}
                      />
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        ) : (
          <View className="h-full flex items-center bg-white">
            <Text className="text-gray-400 text-sm font-medium">
              No Users Found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
