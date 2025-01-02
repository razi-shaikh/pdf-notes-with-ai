"use client";

import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ConvexProvider client={convex}>
      <PayPalScriptProvider
        options={{
          clientId:
            "AV2mHSfxcXAyDHbe7NMkXjDVURBqE1SHkC2ZnzD-7mGzbCZIZJhWWndOnmDiuP2XhRR0n_Qd7g7SmeAw",
        }}
      >
        {children}
      </PayPalScriptProvider>
    </ConvexProvider>
  );
}

export default Provider;
