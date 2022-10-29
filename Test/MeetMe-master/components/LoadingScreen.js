import * as React from "react";

import { ActivityIndicator, View } from "react-native";

export const LoadingScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" />
    </View>
  );
};
