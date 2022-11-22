import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";

import { HomeScreen } from "./pages/Home/Home";
import { LoginScreen } from "./pages/Login/Login";
import { RegisterScreen } from "./pages/Register/Register";
import { AuthProvider, useAuth } from "./Auth/auth";
import { LoadingScreen } from "./components/LoadingScreen";
import SearchScreen from "./pages/Search/Search";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ProfileScreen } from "./pages/Profile/Profile";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  // if (loading) {
  //   //You can see the component implementation at the repository
  //   return <loading />;
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}

const Router = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  const tabIcons = {
    Home: "home",
    Search: "search",
    Profile: "person",
  };

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: "black",
          primary: "black",
        },
      }}
    >
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      {authData?.token ? (
        <>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = tabIcons[route.name];

                iconName = focused ? iconName : iconName + "-outline";

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "black",
              tabBarInactiveTintColor: "gray",
              headerShown: false,
              tabBarStyle: {
                backgroundColor: "white",
                borderTopColor: "#f2f2f2",
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              // options={{ tabBarBadge: 3 }} //for notification
            />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
