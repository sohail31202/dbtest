import fs from "fs";
import uniqid from "uniqid";
import commonConstants from "~/constants/commonConstants";
import folderConstants from "~/constants/folderConstants";
import envConstants from "~/constants/envConstants";
import AWS from "aws-sdk"
const s3Obj = new AWS.S3({
    "accessKeyId": process.env.AWS_S3_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_S3_SECRET_ACCESS_KEY,
    "region": process.env.AWS_S3_REGION
});
const sharp = require("sharp"),
    baseUrl = envConstants.ASSETS_BASE_URL;

/**
 * File Upload Library
 */
export default class FileUpload {
    /**
     * Upload File.
     *
     * @param  {Object} fileObject
     * @param  {String} folder
     * @param  {String} forBlog
     * @returns {Boolean}
     */
    uploadFile(fileObject, folder, forBlog = "") {

        return new Promise((resolve, reject) => {
            if (fileObject !== "" && fileObject !== null && fileObject !== undefined) {
                const ext = fileObject.name.split(".").pop(),
                    directory = commonConstants.STORAGE_PATH + folder,
                    fileName = `${uniqid()}.${ext}`;

                // Check Directory
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { "recursive": true });
                }

                const fileNameWithPath = `${directory}/${fileName}`;

                //console.log('fileObject',fileObject)

                fileObject.mv(fileNameWithPath, (err) => {

                    if (err) {
                        reject(err);
                    } else {

                        const originalImagePath = fileNameWithPath,
                            thumbDirectory = directory + folderConstants.UPLOAD_THUMB_FOLDER;
                        const thumbImagePath = `${thumbDirectory}/${fileName}`;

                        if (forBlog !== "") {
                            /**
                             * Crop image in thumb size(300 X 300) 
                             */
                            sharp(originalImagePath)
                                .rotate()
                                .resize(500, 500)
                                .toBuffer()
                                .then((thumbData) => {
                                    // Check Directory
                                    if (!fs.existsSync(thumbDirectory)) {
                                        fs.mkdirSync(thumbDirectory, { "recursive": true });
                                    }
                                    const writeStream = fs.createWriteStream(thumbImagePath);

                                    // write some data with a base64 encoding
                                    writeStream.write(thumbData, "base64");

                                    // the finish event is emitted when all data has been flushed from the stream
                                    writeStream.on("finish", () => { });

                                }).catch((error) => {
                                    reject(error);
                                });
                        }

                        // const output = { "name": fileName, "path": fileNameWithPath, "thumbImagePath": thumbImagePath };
                        const output = { "name": fileName, "thumbPath": `${baseUrl}${commonConstants.STORAGE_FOLDER}/${folder}${folderConstants.UPLOAD_THUMB_FOLDER}/${fileName}`, "path": `${baseUrl}${commonConstants.STORAGE_FOLDER}/${folder}/${fileName}` };

                        resolve(output);
                    }
                });
            } else {
                const output = { "name": "" };

                resolve(output);
            }
        });
    }


    /**
     * Upload File webp.
     *
     * @param  {Object} fileObject
     * @param  {String} folder
     * @returns {Boolean}
     */
    uploadFileWebp(fileObject, folder) {

        return new Promise((resolve, reject) => {
            if (fileObject !== "" && fileObject !== null && fileObject !== undefined) {
                const ext = fileObject.name.split(".").pop(),
                    directory = commonConstants.STORAGE_PATH + folder,
                    fileName = `${uniqid()}.webp`;

                // Check Directory
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { "recursive": true });
                }

                const fileNameWithPath = `${directory}/${fileName}`;
                // console.log('fileObject',fileObject)

                fileObject.mv(fileNameWithPath, (err) => {

                    if (err) {
                        reject(err);
                    } else {
                        const originalImagePath = fileNameWithPath,
                            thumbDirectory = directory;
                        const thumbImagePath = `${thumbDirectory}/${fileName}`;

                        /**
                         * Crop image in thumb size(300 X 300) 
                         */
                        sharp(originalImagePath)
                            .webp({ quality: 25 })
                            .toBuffer()
                            .then((thumbData) => {
                                // Check Directory
                                if (!fs.existsSync(thumbDirectory)) {
                                    fs.mkdirSync(thumbDirectory, { "recursive": true });
                                }
                                const writeStream = fs.createWriteStream(thumbImagePath);

                                // write some data with a base64 encoding
                                writeStream.write(thumbData, "base64");

                                // the finish event is emitted when all data has been flushed from the stream
                                writeStream.on("finish", () => { });

                            }).catch((error) => {
                                reject(error);
                            });

                        const output = { "name": fileName, "path": fileNameWithPath, "thumbImagePath": thumbImagePath };
                        resolve(output);
                    }
                });
            } else {
                const output = { "name": "" };

                resolve(output);
            }
        });
    }



    /**
     * Upload Multiple Files.
     *
     * @param  {Object} fileObject
     * @param  {String} folder
     * @returns {Boolean}
     */
    uploadMultipleFile(fileObject, folder) {
        const fileArray = [],
            fileObjectLength = fileObject.length;
        let count = 0;

        return new Promise((resolve, reject) => {
            fileObject.map(async (file) => {
                count++;
                const ext = file.name.split(".").pop(),
                    directory = commonConstants.STORAGE_PATH + folder,
                    fileName = `${uniqid()}.${ext}`;

                // Check Directory
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory);
                }

                const fileNameWithPath = `${directory}/${fileName}`;

                fileArray.push(fileName);
                await file.mv(fileNameWithPath, (err) => {
                    if (err) {
                        return reject(false);
                    } else {
                        const originalImagePath = fileNameWithPath,
                            thumbDirectory = directory + folderConstants.UPLOAD_THUMB_FOLDER;
                        const thumbImagePath = `${thumbDirectory}/${fileName}`;

                        /**
                         * Crop image in thumb size(300 X 300) 
                         */
                        sharp(originalImagePath)
                            .rotate()
                            .resize(300, 300)
                            .toBuffer()
                            .then((thumbData) => {
                                // Check Directory
                                if (!fs.existsSync(thumbDirectory)) {
                                    fs.mkdirSync(thumbDirectory, { "recursive": true });
                                }
                                const writeStream = fs.createWriteStream(thumbImagePath);

                                // write some data with a base64 encoding
                                writeStream.write(thumbData, "base64");

                                // the finish event is emitted when all data has been flushed from the stream
                                writeStream.on("finish", () => { });

                            }).catch((error) => {
                                reject(error);
                            });

                        const output = { "name": fileName, "path": fileNameWithPath, "thumbImagePath": thumbImagePath };

                        resolve(output);
                    }

                });
                if (count === fileObjectLength) {
                    return resolve(fileArray);
                }
            });
        });
    }

    /**
     * Upload Category File.
     *
     * @param  {Object} fileObject
     * @param  {String} folder
     * @returns {Boolean}
     */
    uploadCategoryFile(fileObject, folder) {

        return new Promise((resolve, reject) => {
            if (fileObject !== "" && fileObject !== null && fileObject !== undefined) {
                const ext = fileObject.name.split(".").pop(),
                    directory = commonConstants.STORAGE_PATH + folder,
                    fileName = `${uniqid()}.${ext}`;

                // Check Directory
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { "recursive": true });
                }

                const fileNameWithPath = `${directory}/${fileName}`;

                fileObject.mv(fileNameWithPath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        const originalImagePath = fileNameWithPath,
                            thumbDirectory = directory + folderConstants.UPLOAD_THUMB_FOLDER,
                            mediumDirectory = directory + folderConstants.UPLOAD_CATEGORY_STANDARD_FOLDER;
                        const thumbImagePath = `${thumbDirectory}/${fileName}`,
                            mediumImagePath = `${mediumDirectory}/${fileName}`;

                        /**
                         * Crop image in thumb size(300 X 300) 
                         */
                        sharp(originalImagePath)
                            .rotate()
                            .resize(300, 300)
                            .toBuffer()
                            .then((thumbData) => {
                                // Check Directory
                                if (!fs.existsSync(thumbDirectory)) {
                                    fs.mkdirSync(thumbDirectory, { "recursive": true });
                                }
                                const writeStream = fs.createWriteStream(thumbImagePath);

                                // write some data with a base64 encoding
                                writeStream.write(thumbData, "base64");

                                // the finish event is emitted when all data has been flushed from the stream
                                writeStream.on("finish", () => { });

                            }).catch((error) => {
                                reject(error);
                            });


                        /**
                         * Crop image in thumb size(640 X 360) 
                         */
                        sharp(originalImagePath)
                            .rotate()
                            .resize(640, 360)
                            .toBuffer()
                            .then((mediumData) => {
                                // Check Directory
                                if (!fs.existsSync(mediumDirectory)) {
                                    fs.mkdirSync(mediumDirectory, { "recursive": true });
                                }
                                const writeStream = fs.createWriteStream(mediumImagePath);

                                // write some data with a base64 encoding
                                writeStream.write(mediumData, "base64");

                                // the finish event is emitted when all data has been flushed from the stream
                                writeStream.on("finish", () => { });

                            }).catch((error) => {
                                reject(error);
                            });

                        const output = { "name": fileName, "path": fileNameWithPath, "thumbImagePath": thumbImagePath };

                        resolve(output);
                    }
                });
            } else {
                const output = { "name": "" };

                resolve(output);
            }
        });
    }


    /**
     * Upload delivery reciept File.
     *
     * @param  {Object} fileObject
     * @param  {String} folder
     * @returns {Boolean}
     */
    uploadDeliveryRecieptFile(fileObject, folder) {

        return new Promise((resolve, reject) => {
            if (fileObject !== "" && fileObject !== null && fileObject !== undefined) {
                const ext = fileObject.name.split(".").pop(),
                    directory = commonConstants.STORAGE_PATH + folder,
                    fileName = `${uniqid()}.${ext}`;

                // Check Directory
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { "recursive": true });
                }

                const fileNameWithPath = `${directory}/${fileName}`;

                fileObject.mv(fileNameWithPath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        const originalImagePath = fileNameWithPath,
                            thumbDirectory = directory + folderConstants.UPLOAD_THUMB_FOLDER;
                        const thumbImagePath = `${thumbDirectory}/${fileName}`;

                        /**
                         * Crop image in thumb size(200 X 200) 
                         */
                        sharp(originalImagePath)
                            .rotate()
                            .resize(200, 200)
                            .toBuffer()
                            .then((thumbData) => {
                                // Check Directory
                                if (!fs.existsSync(thumbDirectory)) {
                                    fs.mkdirSync(thumbDirectory, { "recursive": true });
                                }
                                const writeStream = fs.createWriteStream(thumbImagePath);

                                // write some data with a base64 encoding
                                writeStream.write(thumbData, "base64");

                                // the finish event is emitted when all data has been flushed from the stream
                                writeStream.on("finish", () => { });

                            }).catch((error) => {
                                reject(error);
                            });

                        const output = { "name": fileName, "receipt_original": fileNameWithPath, "receipt_thumb": thumbImagePath };

                        resolve(output);
                    }
                });
            } else {
                const output = { "name": "" };

                resolve(output);
            }
        });
    }

    /**
     * File unlink.
     *
     * @param  {Object} fileName
     * @param  {String} folder
     * @returns {Boolean}
     */
    unlinkFile(fileName, folder) {
        const directory = commonConstants.STORAGE_PATH + folder,
            path = `${directory}/${fileName}`;

        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);

                return;
            }

            return;
            // file removed
        });
    }


    /**
     * File unlink using file path with name.
     *
     * @param  {String} filePath
     * @returns {Boolean}
     */
    unlinkFileUsingPath(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);

                return;
            }

            return;
            // file removed
        });
    }

    /**
  * Delete Object from  s3 .
  *
  * @param  {Object} path
  * @returns {Object}
  */
    deleteS3File(path) {

        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV == 'development') {
                path = 'development/' + path;
            }
            const params = {
                "Bucket": process.env.AWS_S3_BUCKET_NAME,
                "Key": path
            };

            s3Obj.deleteObject(params, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }
}