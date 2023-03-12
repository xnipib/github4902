import Toast from "react-native-root-toast";

export function openToastr({ message, isError = false }) {
  return Toast.show(message, {
    duration: 3000,
    backgroundColor: isError ? "#aa2b30" : "black",
    textColor: "white",
    textStyle: {
      fontSize: 12,
      color: "white",
    },
  });
}
