import { PrismaClient } from '@prisma/client'

export const seedOnboardingQuestions = async (prisma: PrismaClient) => {
    const questions = [
        { order: 1, text: 'How would you describe your current beauty stash?' },
        { order: 2, text: 'Roughly how many beauty products do you own right now?' },
        { order: 3, text: 'What usually inspires you to buy new products?' },
        { order: 4, text: "When was the last time you checked your products' expiry dates?" },
        { order: 5, text: 'How do you want your beauty journey to feel?' },
    ]

    console.log('running seed: onboarding-questions...')

    await prisma.onboardingQuestion.createMany({
        data: questions,
        skipDuplicates: true,
    })
}
