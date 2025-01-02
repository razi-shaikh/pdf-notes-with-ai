import React from "react";
import Pricing from "./_components/Pricing";

function UpgradePlan() {
  return (
    <div>
      <h2 className="font-medium text-3xl">Our Plans</h2>
      <p>
        Note: The payment integration is currently in development mode. No real
        money will be deducted, and you can use any fake card details to explore
        the functionality for free.
      </p>
      <Pricing />
      {/* <CurrentPlan /> */}
    </div>
  );
}

export default UpgradePlan;
