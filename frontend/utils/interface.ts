export interface Candidate {
    name: string
}

export interface PollFormValues {
    pollTitle: string
    description: string
    pollStart: string
    pollEnd: string
    candidates: Candidate[]
}
