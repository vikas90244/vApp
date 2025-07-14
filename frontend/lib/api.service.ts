// api.service.ts
import { Poll } from "@/components/poll/PollCard";


class ApiService {
    private BASE_URL = "http://localhost:3000/api";

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${this.BASE_URL}/${endpoint}/`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });


        let data;
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        if (isJson && response.status !== 204) { // 204 No Content typically has no body
            try {
                data = await response.json();
            } catch (error) {
                console.error("Error parsing JSON response:", error, "Response text:", await response.text());
                throw new Error('Invalid JSON response from server or server returned non-JSON for an expected JSON response.');
            }
        } else if (response.status === 204) {
            data = null;
        } else {
            const text = await response.text();
            console.error("Non-JSON response from server:", text);
            if (!response.ok) {
                throw new Error(text || `Request failed with status ${response.status}`);
            }

            throw new Error(`Unexpected non-JSON response for ${endpoint}: ${text}`);
        }


        if (!response.ok) {
            throw new Error(data?.message || response.statusText || 'Request failed');
        }

        return data;
    }

    async getPoll(id: string) {
        return this.request(`polls/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    }
    async getPolls(): Promise<Poll[] | []> {
        return this.request('polls');
    }
    async getPollsWallet(wallet_key: string): Promise<Poll[] | []> {
        return this.request(`my-poll/${wallet_key}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    }
    async createPoll(data: any) {
        return this.request('create-poll/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deletePoll(pollId: string) {
        return this.request(`delete-poll/${pollId}/`, {
            method: 'DELETE',

        });
    }
}


export const apiService = new ApiService();
