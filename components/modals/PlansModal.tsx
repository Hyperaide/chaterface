import { motion } from "motion/react";
import Button from "../button";
import { useAuth } from "@/providers/auth-provider";

export default function PlansModal() {
  const { db, user } = useAuth();

  const url = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: window.location.href,
  });
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-xl h-max absolute inset-0 mt-20 z-50 rounded-xl mx-auto">
      <div className="flex flex-col w-full p-2">
        <h1 className="text-sage-12 font-medium text-md">
          Plans
        </h1>
        <p className="text-sage-11 text-sm">
          Choose a plan that works for you.
        </p>

        <div className="grid grid-cols-2 w-full mt-4 gap-2">
          <div className="flex flex-col w-full border border-sage-3 rounded-lg p-4 bg-white dark:bg-sage-2">
            <div className="flex flex-col mb-4">
              <p className="text-sage-12 font-medium text-md">
                $10 / month
              </p>
              <p className="text-sage-11 text-xs">
                Essential. Get access to all models and 1000 credits.
              </p>
            </div>

            {user ? (
              <Button href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} className="mt-auto text-xs bg-sage-1 border border-sage-5 rounded px-2 py-1 text-sage-12 hover:bg-sage-3 dark:bg-sage-3 dark:border-sage-5 dark:text-sage-11 dark:hover:bg-sage-4">
                Get Started
                </Button>
              ) : (
                <Button href={url} className="mt-auto text-xs bg-sage-1 border border-sage-5 rounded px-2 py-1 text-sage-12 hover:bg-sage-3 dark:bg-sage-3 dark:border-sage-5 dark:text-sage-11 dark:hover:bg-sage-4">
                  Sign Up With Google
                </Button>
              )}
          </div>

          <div className="flex flex-col w-full border border-sage-3 rounded-lg p-4 bg-white dark:bg-sage-2">
            <div className="flex flex-col mb-4">
              <p className="text-sage-12 font-medium text-md">
                Free Forever
              </p>
              <p className="text-sage-11 text-xs max-w-xs">
                Ground 0 is fully open source so you can host it yourself and never pay a dime.
              </p>
            </div>

            <Button href="https://github.com/hyperaide/chaterface" className="mt-auto text-xs bg-sage-1 border border-sage-5 rounded px-2 py-1 text-sage-12 hover:bg-sage-3 dark:bg-sage-3 dark:border-sage-5 dark:text-sage-11 dark:hover:bg-sage-4">
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}