'use server'

import { Resend } from 'resend'

interface ClothingRequestData {
  parentName: string
  parentEmail: string
  itemName: string
  category: string
  size: string
  gender: string
  quantity: number
  message: string
}

export async function sendClothingRequest(
  data: ClothingRequestData
): Promise<{ error: string } | { success: true }> {
  const { parentName, parentEmail, itemName, category, size, gender, quantity, message } = data

  if (!process.env.RESEND_API_KEY) {
    return { error: 'Email service is not configured.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const categoryLabel = category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const genderLabel = gender.charAt(0).toUpperCase() + gender.slice(1)

  const body = `New clothing request from the LIS Clothing Swap website.

ITEM
Item:      ${itemName}
Category:  ${categoryLabel}
Size:      ${size}
Gender:    ${genderLabel}

PARENT
Name:      ${parentName}
Email:     ${parentEmail}
Quantity:  ${quantity}

MESSAGE
${message.trim() || 'No message provided.'}

---
Reply to this email to contact the parent directly.`

  const { error } = await resend.emails.send({
    from: 'LIS Clothing Swap <onboarding@resend.dev>',
    to: 'lisclothingrequests@gmail.com',
    replyTo: `${parentName} <${parentEmail}>`,
    subject: `Clothing Request – ${itemName} ${size} (${genderLabel})`,
    text: body,
  })

  if (error) {
    console.error('Failed to send clothing request email:', error)
    return { error: 'Failed to send your request. Please try again.' }
  }

  return { success: true }
}
