import React, { FC } from "react";
import { createNavigationContainerRef } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { BookDetails, BookList } from "../../pages";

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type Props = Record<string, never>;
const Stack = createNativeStackNavigator();

const AppNavigation: FC<Props> = ({}: Props) => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookList" component={BookList} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
    </Stack.Navigator>

  );
};

export default AppNavigation;
