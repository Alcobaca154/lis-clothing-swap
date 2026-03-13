'use server'

import nodemailer from 'nodemailer'

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

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return { error: 'Email service is not configured.' }
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const categoryLabel = category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const body = `New clothing request from the LIS Clothing Swap website.

ITEM
Item:      ${itemName}
Category:  ${categoryLabel}
Size:      ${size}
Gender:    ${gender.charAt(0).toUpperCase() + gender.slice(1)}

PARENT
Name:      ${parentName}
Email:     ${parentEmail}
Quantity:  ${quantity}

MESSAGE
${message.trim() || 'No message provided.'}

---
Reply to this email to contact the parent directly.`

  try {
    await transporter.sendMail({
      from: `LIS Clothing Swap <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: `${parentName} <${parentEmail}>`,
      subject: `Clothing Request – ${itemName} ${size} (${gender.charAt(0).toUpperCase() + gender.slice(1)})`,
      text: body,
    })
    return { success: true }
  } catch (err) {
    console.error('Failed to send clothing request email:', err)
    return { error: 'Failed to send your request. Please try again.' }
  }
}
