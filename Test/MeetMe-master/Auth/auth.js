import * as React from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = React.useState();

  //The loading part will be explained in the persist step session
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorageData function.
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      //Try get the data from Async Storage
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        //If there are data, it's converted to an Object and the state is updated.

        setAuthData({ token });
      }
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const signIn = async (data) => {
    //Set the data in the context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(data);
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    await SecureStore.deleteItemAsync("token");
    setAuthData(undefined);
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
