export interface Candidate {
    name: String
}

export interface PollFormValues {
    pollTitle: string
    description: string
    pollStart: string
    pollEnd: string
    candidates: Candidate[]
}
