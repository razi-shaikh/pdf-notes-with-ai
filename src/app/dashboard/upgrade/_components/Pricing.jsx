"use client";

import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

// Utility function to parse dd/mm/yyyy to a Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // Month is zero-indexed
};

function Pricing() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const userUpgradePlan = useMutation(api.payments.userUpgradePlan);
  const userPlanDetail = useQuery(api.payments.userPlanDetail, {
    email,
  });

  const onPaymentSuccess = async () => {
    try {
      await userUpgradePlan({ email });
      toast.success("Payment successful. Thank you for your purchase!");
    } catch (error) {
      toast.error("An error occurred while upgrading the plan.");
      // console.error("Error upgrading plan:", error);
    }
  };

  const onPaymentCancel = () => {
    toast.warning("Payment cancelled.");
  };

  const planExpireDate = parseDate(userPlanDetail?.planExpireDate);
  const currentDate = new Date();

  let remainingDays = 0;
  if (planExpireDate && planExpireDate > currentDate) {
    const timeDiff = planExpireDate - currentDate;
    remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Calculate in days
  }

  const renderCurrentPlan = () => (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="rounded-2xl border border-indigo-600 p-6 shadow-sm sm:px-8 lg:p-12">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
          <p className="mt-2 sm:mt-4">
            <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
              $10
            </strong>
            <span className="text-sm font-medium text-gray-700">/month</span>
          </p>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div>
            <ul className="mt-6 space-y-2">
              <li>✔️ 10 PDF Uploads</li>
              <li>✔️ Unlimited Notes</li>
              <li>✔️ Email support</li>
              <li>✔️ Help center access</li>
            </ul>
          </div>
          <div>
            <ul className="mt-6 space-y-2">
              <li>✅ Plan Purchase Date: {userPlanDetail?.purchaseDate}</li>
              <li>✅ Plan Expire Date: {userPlanDetail?.planExpireDate}</li>
              <li>✅ No of Purchases: {userPlanDetail?.noOfPurchase}</li>
              <li>✅ Remaining Days: {remainingDays}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanOptions = () => (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
        {/* Free Plan */}
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Free Plan</h2>
            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                $0
              </strong>
              <span className="text-sm font-medium text-gray-700">/month</span>
            </p>
          </div>
          <ul className="mt-6 space-y-2">
            <li>✔️ 5 PDF Uploads</li>
            <li>✔️ Unlimited Notes</li>
            <li>✔️ Email support</li>
            <li>✔️ Help center access</li>
          </ul>
          <button className="mt-8 block w-full rounded-full bg-indigo-600 px-4 py-2 text-white">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="rounded-2xl border border-indigo-600 p-6 shadow-sm sm:px-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Premium Plan</h2>
            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                $10
              </strong>
              <span className="text-sm font-medium text-gray-700">/month</span>
            </p>
          </div>
          <ul className="mt-6 space-y-2">
            <li>✔️ 10 PDF Uploads</li>
            <li>✔️ Unlimited Notes</li>
            <li>✔️ Priority support</li>
            <li>✔️ Advanced analytics</li>
          </ul>
          <div className="mt-8">
            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: "10", currency_code: "USD" },
                    },
                  ],
                });
              }}
              onApprove={onPaymentSuccess}
              onCancel={onPaymentCancel}
              onError={(error) => {
                toast.error("An error occurred during payment.");
                // console.error("PayPal Error:", error);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (userPlanDetail === undefined) {
    return (
      <div className="flex justify-center items-center">
        Loading your plan details...
      </div>
    );
  }

  if (
    userPlanDetail?.currentPlan === "premium" &&
    planExpireDate > currentDate
  ) {
    return renderCurrentPlan();
  }

  return renderPlanOptions();
}

export default Pricing;
