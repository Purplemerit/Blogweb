// Script to reset usage stats for testing
// Run with: npx tsx scripts/reset-usage.ts <user-email>

import prisma from '../lib/prisma'

async function resetUsageStats(userEmail: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      console.error(`User not found: ${userEmail}`)
      process.exit(1)
    }

    // Reset usage stats
    await prisma.usageStats.upsert({
      where: { userId: user.id },
      update: {
        aiGenerationsThisMonth: 0,
        articlesCreatedThisMonth: 0,
        imagesGeneratedThisMonth: 0,
        plagiarismChecksThisMonth: 0,
        lastResetDate: new Date(),
      },
      create: {
        userId: user.id,
        aiGenerationsThisMonth: 0,
        articlesCreatedThisMonth: 0,
        imagesGeneratedThisMonth: 0,
        plagiarismChecksThisMonth: 0,
        lastResetDate: new Date(),
      },
    })

    console.log(`✓ Usage stats reset for ${userEmail}`)
    console.log(`  - AI Generations: 0`)
    console.log(`  - Articles Created: 0`)
    console.log(`  - Images Generated: 0`)
    console.log(`  - Plagiarism Checks: 0`)
  } catch (error) {
    console.error('Error resetting usage stats:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const userEmail = process.argv[2]

if (!userEmail) {
  console.error('Usage: npx tsx scripts/reset-usage.ts <user-email>')
  process.exit(1)
}

resetUsageStats(userEmail)
