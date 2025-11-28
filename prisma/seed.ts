import { PrismaClient } from '@prisma/client'
import { seedSkinConcerns } from './seeds/skin-concerns'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    await seedSkinConcerns(prisma)
    // 
    
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })