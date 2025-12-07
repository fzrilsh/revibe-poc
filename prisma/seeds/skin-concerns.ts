import { PrismaClient } from '@prisma/client'

export const seedSkinConcerns = async (prisma: PrismaClient) => {
    const concerns = [
        'Acne-prone',
        'Sensitive',
        'Uneven tone',
        'Cracking',
        'Dark spots',
        'Dullness',
        'Large pores',
        'Wrinkle/Aging',
        'Dark circles',
        'Hyperpigmentation',
    ]

    console.log('running seed: skin-concerns...')

    await prisma.skinConcern.createMany({
        data: concerns.map((name, id) => ({ id: id + 1, name })),
        skipDuplicates: true,
    })
}