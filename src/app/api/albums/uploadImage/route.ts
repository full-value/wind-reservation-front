import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    // Parse the multipart form data to extract the file and the URL
    const formData = await req.formData(); // Get FormData from the request body

    const urlToUpload = formData.get('urlToUpload'); // Extract presigned URL from the form data
    const compressedFile = formData.get('compressedFile'); // Extract the file from form data

    // Validate the input data
    if (!urlToUpload || !compressedFile) {
      return NextResponse.json(
        { error: 'urlToUpload and compressedFile are required' },
        { status: 400 }
      );
    }

    // Ensure the compressedFile is an instance of File
    if (!(compressedFile instanceof File)) {
      return NextResponse.json(
        { error: 'The compressedFile must be a valid file' },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer (S3 requires binary data)
    const fileBuffer = await compressedFile.arrayBuffer();
    const binaryFile = Buffer.from(fileBuffer);

    // Upload the file to the provided presigned URL (S3 URL)
    const response = await fetch(urlToUpload.toString(), {
      method: 'PUT',
      body: binaryFile, // Send the binary file
      headers: {
        'Content-Type': compressedFile.type || 'application/octet-stream',
      },
    });

    // Check if the upload to S3 was successful
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('S3 upload failed:', errorMessage);
      return NextResponse.json(
        { error: 'Failed to upload to the presigned URL' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error in /api/albums/uploadImage:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
