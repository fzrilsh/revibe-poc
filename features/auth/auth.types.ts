export type RegisterDto = {
    nickname: string
    birth_year?: number | null
    skin_type?: 'OILY' | 'DRY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL' | null
    skin_concern_ids?: number[]
    onboarding_answers?: { questionId: number; answer: string }[]
    profile_image?: string | null
    gender?: string | null
}

export type UserPublic = {
    id: string
    nickname?: string | null
    birth_year?: number | null
    profile_image?: string | null
    gender?: string | null
    skin_type?: string | null
    created_at: string
    skin_concerns?: { id: number; name: string }[]
    onboarding_answers?: { question_text?: string | null; answer: string }[]
}
