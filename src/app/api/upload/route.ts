import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// POST /api/upload - Handle file upload (Mock implementation)
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // In a real implementation, you would:
        // 1. Validate file type/size
        // 2. Upload to Cloudinary, AWS S3, or local storage
        // 3. Return the public URL

        console.log(`File upload requested: ${file.name} (${file.size} bytes)`)

        // Mocking a successful upload delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Returning a placeholder URL (using a free random image service for demo)
        const mockUrl = `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/400`

        return NextResponse.json({
            url: mockUrl,
            name: file.name,
            size: file.size,
            message: 'อัปโหลดรูปภาพสำเร็จ (Demo Mode)'
        })

    } catch (error: any) {
        console.error('[UPLOAD_POST]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
