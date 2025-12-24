import AppProvider from "context/app.context";
import { DefaultTheme, ThemeProvider, DarkTheme } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, Text, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
                <View style={{
                    backgroundColor: "#333", padding: 10,
                    borderRadius: 3, gap: 10
                }}>
                    <Text style={{ color: "red", fontSize: 20 }}>
                        Something went wrong
                    </Text>
                    <Text style={{ color: "#fff" }}>{error.message}</Text>
                </View>
                <Button title="Try Again ?" onPress={retry} />
            </View>
        </SafeAreaView>
    );
}

const RootLayout = () => {
    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'white',
        },
    };

    return (
        <GestureHandlerRootView>
            <RootSiblingParent>
                <AppProvider>
                    <ThemeProvider value={navTheme}>
                        <Stack
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: 'white',
                                },
                                headerTintColor: APP_COLOR.ORANGE,
                                headerTitleStyle: {
                                    color: "black",
                                },
                                // contentStyle: { backgroundColor: "#fff" }
                            }}
                        >
                            <Stack.Screen
                                name="index"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/login"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/signup"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/verify"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/welcome"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="product/[id]"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="product/create.modal"
                                options={{
                                    headerShown: false,
                                    animation: "fade",
                                    presentation: "transparentModal",
                                }}
                            />
                            <Stack.Screen
                                name="product/update.modal"
                                options={{
                                    headerShown: false,
                                    animation: "fade",
                                    presentation: "transparentModal",
                                }}
                            />
                            <Stack.Screen
                                name="product/place.order"
                                options={{ headerTitle: "Xác nhận đơn hàng" }}
                            />
                        </Stack>
                    </ThemeProvider>
                </AppProvider>
            </RootSiblingParent>
        </GestureHandlerRootView>
    )
}

export default RootLayout;