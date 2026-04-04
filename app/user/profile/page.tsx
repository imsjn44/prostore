import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Customer profile",
};

const Profile = async () => {
  const session = await auth();

  // If no session, redirect to login so the provider never tries to fetch
  if (!session) {
    redirect("/api/auth/sign-in");
  }

  return (
    <SessionProvider session={session}>
      <div className="max-w-md  mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        Hello, {session?.user?.name}
      </div>
      <ProfileForm />
    </SessionProvider>
  );
};

export default Profile;
