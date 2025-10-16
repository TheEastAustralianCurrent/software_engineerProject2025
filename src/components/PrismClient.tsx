"use client";
import React from "react";
import Prism from "@/components/Prism";

export default function PrismClient() {
  // Render Prism into a fixed, full-viewport container at the top of the DOM.
  // Use an inline zIndex to ensure it sits behind other layers even if some
  // elements create stacking contexts.
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -9999, pointerEvents: "none" }}>
    <Prism 
      hoverStrength={2}
      inertia={.5}
      colorFrequency={3}
      bloom={4}
      height={5}
      baseWidth={Math.random() * 0.5 + 0.75}
      animationType="hover"
      glow={1}
      scale={5}
      hueShift={Math.random() * 0.5 + 0.75}

    suspendWhenOffscreen={true} transparent={true} />
</div>
  );
}
