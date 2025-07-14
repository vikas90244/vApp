/**
 * @file retryQueue.ts
 * @description
 *  A lightweight, persistent retry-queue that stores failed backend requests
 *  in the browser’s `localStorage` and re-attempts them on a timed interval.
 */

import { apiService } from "./api.service";


/** LocalStorage key used to persist the queue. */
const LOCAL_QUEUE_KEY = 'booth_backend_retry_queue';


/**
 * Represents a single task to be (re)sent to the backend.
 *
 * @property type        Logical name of the backend operation.
 * @property payload     Data required by the backend.
 * @property retryCount  Number of retries already attempted (internal).
 */
export type RetryItem = {
    type: "create_poll";
    payload: any;
    retryCount?: number;
}


/**
 * Manages the retry queue.
 * Use `retryQueue` (exported at the bottom) instead of `new RetryQueue()`
 * to ensure only a single instance runs in the application.
 */
export class RetryQueue{

    /** Lazily-created instance of queue to ensure a single -
     *  queue is used throughout .
     */
    private static instance: RetryQueue;

    /** True while [processQueue()] */
    private isProcessing = false;

    /** Keeps track of intervalId , useRef is used to preserve the id throughout
     *  re-renders without triggering UI renders 
     *  Later Used to clearInterval When we're done processing a queue.
     * */
    private intervalRef: NodeJS.Timeout|undefined;

    /** How often to process the queue (ms). */
    private readonly RETRY_INTERVAL = 5000;

    /** Maximum number of retries per item. */
    private readonly MAX_RETRIES = 5;


    /** Private to force consumers to use [getInstance()] */
    private constructor(){};

   /**
   * Get the singleton instance.
   * @returns {RetryQueue}.
   */
    public static getInstance(): RetryQueue{
        if(!RetryQueue.instance){
            RetryQueue.instance = new RetryQueue();
        }
        return RetryQueue.instance;
    }


    /**
     * Read & parse the queue from `localStorage`.
     * @returns Deserialized queue (empty array if key missing / corrupted).
     */
    public getRetryQueue(): RetryItem[] {
        try {
            const queue = localStorage.getItem(LOCAL_QUEUE_KEY);
            return queue ? JSON.parse(queue) : [];
        } catch (error) {
            console.error('[RETRY] Error reading retry queue from localStorage:', error);
            return [];
        }
    }

   /**
   * Persist the queue back to `localStorage`.
   * @param item of type `{RetryItem[]}` Queue to save.
   */

    public saveRetryQueue(queue: RetryItem[]) {
        try {
            localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(queue));
        } catch (error) {
            console.error('[RETRY] Error saving retry queue to localStorage:', error);
        }
    }



   /**
   * Enqueue a new item to retry later.
   * @param item   New retry item.
   * @returns     Stored item (with `retryCount` initialized).
   */
    public addToRetryQueue(item: RetryItem) {
        const queue = this.getRetryQueue();
        const newItem: RetryItem = {
            ...item,
            retryCount: item.retryCount ?? 0,
        };
        queue.push(newItem);
        this.saveRetryQueue(queue);
        return newItem;
    }

    /**
   * Clear all pending items from the queue.
   * @returns `true` if successful, otherwise `false`.
   */
    public clearQueue() {
        try {
            localStorage.removeItem(LOCAL_QUEUE_KEY);
            return true;
        } catch (error) {
            console.error('[RETRY] Error clearing retry queue:', error);
            return false;
        }
    }

    /** @returns Number of items currently waiting to be retried. */
    public getQueueSize(): number {
        return this.getRetryQueue().length;
    }

  /*              ----------Prcessing / retry mechanics-----------             */

  /**
   * Iterate over the queue and retry each item.
   *
   *   1. Exits early if another run is already in progress.
   *   2. Skips processing when the queue is empty.
   *   3. Retries items; those that still fail are re-queued with
   *      an incremented `retryCount`.
   *   4. Items exceeding `MAX_RETRIES` are dropped and logged.
   *   5. Saves the (potentially) reduced queue back to storage.
   */
    private async processQueue(): Promise<void> {
        if(this.isProcessing) return;
        this.isProcessing = true;

        try {
            const queue = this.getRetryQueue();
            if(queue.length==0) {
               return;
            }
            console.log(`processing ${queue.length} items`);

            const remaining: RetryItem[] = [];

            for(const item of queue) {

                try{
                    if ((item.retryCount ?? 0) >= this.MAX_RETRIES) {
                        console.error('Max retries reached for item:', item);
                        continue;
                    }
                    console.log("processing item ", item);
                    const response = await fetch('/api/create-poll', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(item.payload),
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to create poll');
                    }
                } catch(err){
                    console.log("failed to update again ", item);
                    remaining.push({...item, retryCount: (item.retryCount??0)+1});
                };
            }


                this.saveRetryQueue(remaining);
                console.log(`Queue updated. Processed: ${queue.length}, Remaining: ${remaining.length}`);

        } catch (error) {
            console.error('Error processing queue:', error);
        } finally {
            this.isProcessing= false;
        }
    }

  /**
   * Start periodic processing (idempotent).
   * Safe to call multiple times; only the first call takes effect.
   */
    public startProcessing():void {
        if(this.intervalRef) return;
        console.log("[RETRY] start processing queue ");
        this.intervalRef =  setInterval(()=>this.processQueue(), this.RETRY_INTERVAL);
    }

   /**
   * Stop periodic processing and clear the interval.
   */
    public stopProcessing():void {
        if(this.intervalRef){
            console.log("Stopping queue processing");
            clearInterval(this.intervalRef);
            this.intervalRef = undefined;
        }
    }
};


/** Shared singleton used across the frontend. */
export const retryQueue = RetryQueue.getInstance();
