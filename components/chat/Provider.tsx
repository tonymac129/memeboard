"use client";

import { RealtimeProvider } from "@upstash/realtime/client";

function Provider({ children }: { children: React.ReactNode }) {
  return <RealtimeProvider>{children}</RealtimeProvider>;
}

export default Provider;
