import * as React from "react";

import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-root-toast";

import { useLogin } from "./data/useLogin";

import { Input } from "../../components";
import { useAuth } from "../../Auth/auth";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const auth = useAuth();

  const { isLoading, mutate: doLogin } = useLogin({
    onSuccess: (token) => {
      Toast.show("Login Successfully", {
        duration: 3000,
        backgroundColor: "white",
        textColor: "black",
        textStyle: {
          fontSize: 12,
          color: "black",
        },
      });

      auth.signIn({ token });
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

  const submitBtnContent = isLoading ? (
    <ActivityIndicator />
  ) : (
    <Text className="text-white text-center font-bold">Login</Text>
  );

  const onSubmitClick = () => {
    doLogin({ email, password });
  };

  return (
    <SafeAreaView className>
      <View className="pt-8 px-3 mt-5">
        <Text className="text-black text-2xl font-bold mb-2">
          Let's sign you in
        </Text>
        <Text className="text-black text-xl leading-7">
          Welcome back.{"\n"}You've been missed!
        </Text>

        <Text className="text-black text-sm leading-7 mt-8 font-medium">
          Email
        </Text>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={{
            marginTop: 2,
          }}
          textContentType="emailAddress"
          placeholder="Email"
        />

        <Text className="text-black text-sm leading-7 mt-2 font-medium">
          Password
        </Text>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          style={{
            marginTop: 2,
          }}
          secureTextEntry={true}
          placeholder="Password"
        />

        <Pressable
          className="bg-black mt-5 rounded-lg p-3 text-white"
          onPress={onSubmitClick}
          disabled={isLoading}
        >
          {submitBtnContent}
        </Pressable>

        <View className="flex items-center justify-center mt-8">
          <Text className="text-black text-sm font-medium  text-center">
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text className="text-black text-sm font-medium underline">
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
