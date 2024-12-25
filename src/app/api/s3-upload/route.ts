import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    },
});

// Define a function to upload a file to S3
async function uploadFileToS3(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType, // Use the correct MIME type from the uploaded file
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the URI (URL) of the uploaded file
    const fileUri = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    // Log the URI of the uploaded file
    console.log('Uploaded file URI:', fileUri);

    return fileUri; // Return the full URL of the uploaded file
}

// Handle POST request
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        // Convert the file to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Use the file name and MIME type from the uploaded file
        const fileName = `uploads/${file.name}`;  // Can include directory structure if needed
        const contentType = file.type;  // MIME type of the file (e.g., "image/jpeg", "image/png")

        // Upload the file to S3
        const uploadedFileUri = await uploadFileToS3(buffer, fileName, contentType);

        return NextResponse.json({ success: true, fileUri: uploadedFileUri });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
