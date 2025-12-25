import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#0a7ea4',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    title: 'Sign In',
                    headerShown: false, // Full screen login
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    title: 'Create Account'
                }}
            />
        </Stack>
    );
}
