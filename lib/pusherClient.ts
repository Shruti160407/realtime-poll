/*import Pusher from "pusher-js";

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);
*/

import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;

  if (!pusherClient) {
    pusherClient = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      }
    );
  }

  return pusherClient;
};
