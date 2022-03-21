import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
export default class S3Bucket {
	constructor() {
		this.bucketName = process.env.S3_BUCKET_NAME;
		this.bucketRegion = process.env.S3_BUCKET_REGION;
		this.client = new S3Client({
			region: this.bucketRegion,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			},
		});
	}
	async editImage(image) {
		return await sharp(image).webp({ lossless: true }).toBuffer();
	}

	async uploadImage(Key, Body) {
		const params = {
			Bucket: this.bucketName,
			Key,
			Body,
			ACL: 'public-read',
		};
		const command = new PutObjectCommand(params);
		return await this.client.send(command);
	}

	async getImageUrl(name, image) {
		const result = await this.uploadImage(
			name,
			await this.editImage(image)
		);
		if (result.$metadata.httpStatusCode === 200)
			return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${name}`;
	}

	async deleteImage(Key) {
		const params = {
			Bucket: this.bucketName,
			Delete: { Objects: [{ Key }] },
		};
		const command = new DeleteObjectCommand(params);
		await this.client.send(command);
	}
}
