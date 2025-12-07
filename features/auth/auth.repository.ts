import { SkinType } from '@prisma/client'
import prisma from '../../lib/prisma'
import type { RegisterDto } from './auth.types'

export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            onboardingAnswers: { include: { question: true } },
            skinConcerns: {
                include: { skinConcern: true }
            }
        }
    })
}

export async function createUser(data: RegisterDto) {
    const { nickname, birth_year, skin_type, skin_concern_ids, onboarding_answers } = data

    return await prisma.user.create({
        data: {
            nickname,
            birthYear: birth_year ?? null,
            profileImage: (data as any).profile_image ?? null,
            skinType: skin_type ?? null,

            skinConcerns: skin_concern_ids?.length
                ? {
                    create: skin_concern_ids.map(id => ({
                        skinConcern: { connect: { id } }
                    }))
                }
                : undefined,

            onboardingAnswers: onboarding_answers?.length
                ? {
                    create: onboarding_answers.map(a => ({
                        question: { connect: { id: a.questionId } },
                        value: a.answer
                    }))
                }
                : undefined
        },
        include: {
            skinConcerns: { include: { skinConcern: true } },
            onboardingAnswers: { include: { question: true } }
        }
    })
}

export async function updateUser(id: string, data: any) {
    const { birthYear, skinType, profileImage, nickname, skinConcernIds } = data

    // If skinConcernIds provided, update user and many-to-many in a transaction
    if (skinConcernIds) {
        return prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: {
                    birthYear,
                    profileImage,
                    skinType: skinType ? (skinType as SkinType) : null,
                    nickname: nickname ?? undefined,
                }
            })

            await tx.userSkinConcern.deleteMany({ where: { userId: id } })

            if (skinConcernIds.length) {
                await tx.userSkinConcern.createMany({
                    data: skinConcernIds.map((scId: number) => ({
                        userId: id,
                        skinConcernId: scId,
                    }))
                })
            }

            return tx.user.findUnique({
                where: { id },
                include: {
                    onboardingAnswers: { include: { question: true } },
                    skinConcerns: { include: { skinConcern: true } }
                }
            })
        })
    }

    // Without skin concerns, simple update
    return prisma.user.update({
        where: { id },
        data: {
            birthYear,
            profileImage,
            skinType: skinType ? (skinType as SkinType) : null,
            nickname: nickname ?? undefined,
        },
        include: {
            onboardingAnswers: { include: { question: true } },
            skinConcerns: { include: { skinConcern: true } }
        }
    })
}