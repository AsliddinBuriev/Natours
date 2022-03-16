import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';

export default class S3Bucket {
	constructor() {
		this.bucketName = process.env.S3_BUCKET_NAME;
		this.client = new S3Client({
			region: process.env.S3_BUCKET_REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			},
		});
	}
	uploadImage(Key, Body) {
		const params = {
			Bucket: this.bucketName,
			Key,
			Body,
			ACL: 'public-read',
		};
		const command = new PutObjectCommand(params);
		return this.client.send(command);
	}
	async getImageUrl(image, name) {
		const result = await this.uploadImage(name, image);
		if (result.$metadata.httpStatusCode === 200)
			return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${name}`;
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
