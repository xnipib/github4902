import * as React from "react";

import { TextInput } from "react-native";

export function Input(props) {
  return (
    <TextInput
      {...props}
      style={{
        color: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        ...props.style,
      }}
    />
  );
}
