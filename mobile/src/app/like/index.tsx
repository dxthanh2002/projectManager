import { Button, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Like = () => {
  const navigation: any = useNavigation();
  return (
    <View>
        <Text>
            Like Component
        </Text>
        <Button onPress={() => navigation.navigate("LikeDetail")} title="Go to like detail"></Button>
    </View>
  )
}

export default Like;