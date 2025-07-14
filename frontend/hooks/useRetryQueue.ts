/**
 * @file useBackendRetryQueue.ts
 * @description
 * React hook that ties the global retry-queue’s processing lifecycle to the
 * user’s authentication state.
 *
 * Place this hook near the top of your component tree (e.g. `App.tsx`) so it is
 * mounted for the lifetime of the application.
 */

import { useEffect, useRef } from "react";
import { retryQueue } from "@/lib/retryQueue";


export function useRetryQueue(){

        useEffect(() => {
            console.log("intializing retry queue");

            if(retryQueue.getQueueSize() > 0){

             // Ensure processing is active when the user is logged in.
                retryQueue.startProcessing();
            } else {
             // Pause processing while logged-out.
    
                retryQueue.stopProcessing();
            }

        }, [ ]);
}
