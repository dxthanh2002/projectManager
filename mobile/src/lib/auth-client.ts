import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// Base URL của Better Auth backend
// Development: 
//   - Android Emulator: 10.0.2.2 (alias for host localhost)
//   - iOS Simulator: localhost
//   - Physical device: use your machine's IP (e.g., 192.168.1.100)
// Production: use production server URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5001";

export const authClient = createAuthClient({
    baseURL: BASE_URL,
    plugins: [
        expoClient({
            scheme: "mobile", // Phải khớp với scheme trong app.json
            storagePrefix: "mobile",
            storage: SecureStore,
        }),
    ],
});

// Export các hooks và methods tiện ích
export const { signIn, signUp, signOut, useSession } = authClient;
