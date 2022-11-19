import * as React from "react";

import { ActivityIndicator, SafeAreaView } from "react-native";

export const LoadingScreen = () => {
  return (
    <SafeAreaView className="flex flex-1 flex items-center justify-center bg-white">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};
