// export async function POST(req) {
//     const data = await req.formData();
//     if (data.get('file')) {
//         //upload the file

//     }
//     return Response.json(true);
// } 
/* import CredentialsProvider from "next-auth/providers/credentials";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import uniquid from "uniquid"
export async function POST(req) {
    const data = await req.formData();
    if (data.get('file')) {
        //upload the file
        const file = data.get('file');
        const s3Client = new S3Client({
            region: 'us-east-1',
            cresdentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });

    const ext = file.name.split('.').slice(-1)[0];
    const newFileName = uniquid() + '.' + ext;

    const chunks = [];
    for await (const chunk of file.stream()) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await s3Client.send(new PutObjectCommand({
        Bucket: 'food-order',
        Key: newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: buffer,
    }));

    const link = 'https://'+bucket+'.s3.amazonaws.com/'+newFileName;
    return Response.json(link);
    }
    return Response.json(true);
} */

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Chuyển file thành buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer lên Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "menuItem" }, // ảnh sẽ nằm trong folder "foodfast"
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return Response.json({ url: uploadResult.secure_url });
    
  } catch (err) {
    console.error("Upload failed:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
