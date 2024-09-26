import LoginPage from "@/components/auth";
import Provider from "@/components/Providers";
import { UserProvider } from "@/contexts/userContext";

export default function Auth() {
  return (
    <Provider>
      <UserProvider>
        <LoginPage />
      </UserProvider>
    </Provider>
  );
}
