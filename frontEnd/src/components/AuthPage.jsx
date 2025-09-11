import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { User } from "lucide-react";

export default function AuthPage() {
  const { isSignedIn, user } = useUser();
  const [isLogin, setIsLogin] = useState(true);

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome, {user.fullName}</h2>
          <img
            src={user.imageUrl}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass morphism container */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          {/* Clerk auth components */}
          {isLogin ? (
            <SignIn
              path="/auth"
              routing="path"
              signUpUrl="/auth?mode=signup"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700",
                  card: "bg-transparent shadow-none",
                },
              }}
            />
          ) : (
            <SignUp
              path="/auth"
              routing="path"
              signInUrl="/auth?mode=login"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700",
                  card: "bg-transparent shadow-none",
                },
              }}
            />
          )}

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
