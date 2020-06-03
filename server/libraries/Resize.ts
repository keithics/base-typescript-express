'use strict';

/**
 * Module dependencies.
 */
import * as path from 'path';
import * as fs from 'fs';
import {config} from "../config/config";
const _ = require('lodash');
const async = require('async');
const multer = require('multer'),
	https = require('https'),
	mime = require('mime'),
	crypto = require('crypto'),
	axios = require('axios'),
	root = path.join(__dirname, '../public');

/*
  TODO pass as config
 */
let { imageProxyServer, GOOGLE_CDN_ORIGINAL, KEY, SALT, PROJECT_ID, JSON_FILE, GOOGLE_CDN } = config.googleCDN

const multerStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, root + '/uploads/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype).replace('jpeg', 'jpg'));
		});
	}
})

const uploadConfig = {
	fileFilter: function (req, file, cb) {
		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
			return cb(new Error('Only image files are allowed! 20MB max.'), false);
		} else {
			cb(null, true);
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024 // Max file size in bytes (20 MB)
	},
	dest: null

};

/** imgproxy salting **/
const urlSafeBase64 = (string) => {
	return Buffer.from(string).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret) => {
	const hmac = crypto.createHmac('sha256', hexDecode(secret))
	hmac.update(hexDecode(salt))
	hmac.update(target)
	return urlSafeBase64(hmac.digest())
}

/****************************/

/** google storage **/
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
	projectId: PROJECT_ID,
	keyFilename: path.resolve(__dirname + '/' + JSON_FILE)
});

const bucketOriginal = storage.bucket('ark-dev-original-images');
const bucketResized = storage.bucket('ark-dev-assets');

const uploadLocalImage = (req, res, callback) => {
	var upload = multer({
		storage: multerStorage,
		fileFilter: uploadConfig.fileFilter,
		limits: uploadConfig.limits
	}).single('photo');
	upload(req, res, function (uploadError) {
		if (uploadError) {
			callback({
				message: 'Error uploading file , Only JPG/PNG files are allowed.(1)'
			});
		} else {
			let localImage = root + '/uploads/' + req.file.filename;
			callback(null, localImage)
		}
	})
}

const uploadOriginalImage = (localImage, callback) => {
	bucketOriginal.upload(localImage, callback)
}

const uploadResizedImage = (localImage, callback) => {
	bucketResized.upload(localImage, callback)
}

const resizeImageUrl = (filename, callback) => {
	const fullUrl = GOOGLE_CDN_ORIGINAL + filename;
	const resizing_type = 'fit'
	const width = 300
	const height = 300
	const gravity = 'no'
	const enlarge = 1
	const extension = 'png'
	const encoded_url = urlSafeBase64(fullUrl)
	const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`
	const signature = sign(SALT, path, KEY)
	const resizedImageUrl = `${imageProxyServer}/${signature}${path}`
	callback(null, filename, resizedImageUrl)
}

const downloadImage = (filename, resizedImageUrl, callback) => {
	axios.request({
		responseType: 'arraybuffer',
		url: resizedImageUrl,
		method: 'get',
		headers: {
			'Content-Type': 'image/png',
		}
	}).then((result) => {
		const outputFilename = root + '/temp/' + filename;
		fs.writeFile(outputFilename, result.data, (err) => {
			if (err) callback(err);
			callback(null, outputFilename)
		});
	});
}

export const resize = function (req, res, type) {

	async.waterfall([
		function (callback) {
			uploadLocalImage(req, res, callback)//upload to localdisk
		},
		function (localImage, callback) {
			uploadOriginalImage(localImage, callback)//upload to google - original image,renamed
		},
		function (data, response, callback) {
			resizeImageUrl(response.name, callback)//generate resize URL
		},
		function (filename, resizedImageUrl, callback) {
			downloadImage(filename, resizedImageUrl, callback)// download resized Image
		},
		function (outputFilename, callback) {
			uploadResizedImage(outputFilename, callback) // upload to google
		}
	], function (err, file, response) {
		if (err) {
			res.status(422).send(err)
		} else {
			response.url = GOOGLE_CDN + response.name;
			response.type = type;

			res.send(response)
		}

	});
}

export const resizeIcon = function (req, res, type) {
	uploadConfig.dest = root + '/uploads/' + type + '/'
	const upload = multer(uploadConfig).single('photo');

	upload(req, res, function (uploadError) {
		if (uploadError) {
			return res.status(400).send({
				message: 'Error uploading file , Only PNG files are allowed.'
			});
		} else {
			fs.rename(req.file.path, req.file.path + path.extname(req.file.originalname),null);
			req.file.url = req.protocol + '://' + req.headers.host + '/uploads/' + type + '/' + req.file.filename + path.extname(req.file.originalname);
			res.jsonp({file: req.file, n: req.params.n});

		}
	});
}

var upload64 = function(req, res, contents, callback = null){
	const base64Data = contents.replace(/^data:image\/png;base64,/, "");
	async.waterfall([
		function (callback) {
			crypto.pseudoRandomBytes(16, function (err, raw) {
				const filename = raw.toString('hex') + Date.now() + '.png';
				const file = root + '/uploads/' + filename;
				require("fs").writeFile(file, base64Data, 'base64', function (err) {
					callback(err, file)
				});
			});

		},
		function (localImage, callback) {
			uploadOriginalImage(localImage, callback)//upload to google - original image,renamed
		},
		function (data, response, callback) {
			resizeImageUrl(response.name, callback)//generate resize URL
		},
		function (filename, resizedImageUrl, callback) {
			downloadImage(filename, resizedImageUrl, callback)// download resized Image
		},
		function (outputFilename, callback) {
			uploadResizedImage(outputFilename, callback) // upload to google
		}
	], callback);
}

export const base64Image = function (req, res) {
	upload64(req, res, req.body.contents ,function (err, file, response) {
		if (err) {
			res.status(422).send(err)
		} else {
			response.url = GOOGLE_CDN + response.name;
			res.send(response)
		}

	})
}

export const upload64Image = function (req, res, contents, callback) {
	upload64(req, res, contents ,function (err, file, response) {
		callback(err, response)
	})
}

