import { createAuthClient } from "better-auth/client"
import { passkeyClient } from "@better-auth/passkey/client"

export const authClient = createAuthClient({
    plugins: [
        passkeyClient()
    ],
    // The baseURL needs to match the server baseURL
    // In dev, usually http://localhost:4321
})
