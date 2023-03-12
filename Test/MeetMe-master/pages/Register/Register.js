import * as React from "react";

import {
  View,
  Text,
  Button,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-root-toast";
import { Input } from "../../components";
import { openToastr } from "../../utils/Toast";
import { useRegister } from "./data/useRegister";

export function RegisterScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const { isLoading, mutate: doLogin } = useRegister({
    onSuccess: () => {
      navigation.navigate("Login");
      openToastr({ message: "Registered Successfully" });
    },
    onError: (error) => {
      openToastr({
        message: error?.response?.data?.message ?? "Server error",
        isError: true,
      });
    },
  });

  const submitBtnContent = isLoading ? (
    <ActivityIndicator />
  ) : (
    <Text className="text-white text-center font-bold">Register</Text>
  );

  const onSubmitClick = () => {
    doLogin({ email, password, name, password_confirmation: confirmPassword });
  };

  return (
    <SafeAreaView>
      <View className="pt-8 px-3 mt-5">
        <Text className="text-black text-2xl font-bold mb-2">
          Welcome to{"\n"}Meet Up
        </Text>
        <Text className="text-black text-xl leading-7">Create an account</Text>

        <Text className="text-black text-sm leading-7 mt-8 font-medium">
          Name
        </Text>
        <Input
          onChangeText={(text) => setName(text)}
          value={name}
          style={{
            marginTop: 2,
          }}
          placeholder="Name"
        />

        <Text className="text-black text-sm leading-7 mt-2 font-medium">
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

        <Text className="text-black text-sm leading-7 mt-2 font-medium">
          Confirm Password
        </Text>
        <Input
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          style={{
            marginTop: 2,
          }}
          secureTextEntry={true}
          placeholder="Confirm Password"
        />

        <Pressable
          className="bg-black mt-5 rounded-lg p-3"
          onPress={onSubmitClick}
          disabled={isLoading}
        >
          {submitBtnContent}
        </Pressable>

        <View className="flex items-center justify-center mt-8">
          <Text className="text-black text-sm font-medium  text-center">
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text className="text-black text-sm font-medium underline">
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
