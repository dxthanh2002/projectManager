import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// Base URL của Better Auth backend
// Development: dùng IP máy tính của bạn thay vì localhost
// Production: dùng URL production server
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

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
