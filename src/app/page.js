"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Utility function to parse dd/mm/yyyy to a Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // Month is zero-indexed
};

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const downgradePlan = useMutation(api.payments.userDowngradePlan);

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkAndDowngradePlan();
    } else {
      return;
    }
  }, [user]);

  const checkUser = async () => {
    try {
      await createUser({
        userName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
      });
    } catch (error) {
      // console.log("Error creating user:", error);
    }
  };

  const checkAndDowngradePlan = async () => {
    try {
      const userPlanDetail = useQuery(api.payments.userPlanDetail, {
        email: user?.primaryEmailAddress?.emailAddress,
      });
      const planExpireDate = parseDate(userPlanDetail?.planExpireDate);
      const currentDate = new Date();

      if (planExpireDate && planExpireDate < currentDate) {
        await downgradePlan({
          email: user?.primaryEmailAddress?.emailAddress,
        });
        // console.log("User plan downgraded.");
      }
    } catch (error) {
      // console.log("Error downgrading user plan:", error);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-slate-50 to-red-50">
      <div className="font-semibold">
        {/* navbar */}
        <nav className="p-4">
          <div className="flex justify-between">
            <div className="flex cursor-pointer items-center gap-2 ">
              <Image src={"/blackLogo.svg"} alt="logo" width={40} height={40} />
              <p class="font-sfProDisplay font-semibold text-xl">PDFNotes</p>
            </div>

            {user ? (
              <UserButton />
            ) : (
              <Link href={"/sign-in"}>
                <button className="text-xl bg-black text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                  Sign-in
                </button>
              </Link>
            )}
          </div>
        </nav>
        {/* main */}
        <div className="">
          <div className="flex flex-col justify-center items-center h-screen gap-4 mx-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Simplify <span className="text-red-500">PDF</span>{" "}
                <span className="text-blue-500">
                  Note-Taking
                  <br />
                </span>{" "}
                with AI-Powered
              </h1>
            </div>
            <div>
              <p className="mt-4 text-lg text-gray-600">
                Elevate your note-taking experience with our AI-powered PDF app.
                Seamlessly extract key insights, summaries, and annotations from
                any PDF with just a few clicks.
              </p>
            </div>
            <div className="mt-8">
              {user ? (
                <Link href={"/dashboard"}>
                  <button className="text-xl bg-black text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
                    Goto Dashboard
                  </button>
                </Link>
              ) : (
                <Link href={"/sign-up"}>
                  <button className="text-xl bg-black text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
                    Sign-up
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
