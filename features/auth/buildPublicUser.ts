import { buildPublicUrl } from '@/lib/config'
import type { UserPublic } from './auth.types'

export function buildPublicUser(user: any): UserPublic {
    return {
        id: user.id,
        nickname: user.nickname ?? null,
        // support both prisma camelCase and snake_case db fields
        birth_year: (user.birthYear ?? (user as any).birth_year) ?? null,
        profile_image: buildPublicUrl((user.profileImage ?? (user as any).profile_image) ?? null),
        gender: (user.gender ?? (user as any).gender) ?? null,
        skin_type: (user.skinType ?? (user as any).skin_type) ?? null,
        created_at: user.createdAt?.toISOString?.() ?? (user as any).created_at ?? new Date().toISOString(),
        skin_concerns: (user.skinConcerns ?? (user as any).skin_concerns)?.map((usc: any) => {
            const sc = usc.skinConcern ?? usc.skin_concern ?? usc
            return { id: sc.id, name: sc.name }
        }) ?? undefined,
        onboarding_answers: (user.onboardingAnswers ?? (user as any).onboarding_answers)?.map((ua: any) => {
            const question = ua.question ?? (ua as any).question ?? null
            const questionText = question?.text ?? (question as any)?.text ?? null
            return {
                question_text: questionText,
                answer: ua.value ?? ua.answer ?? ''
            }
        }) ?? undefined,
    }
}
