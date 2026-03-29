const fs = require('fs');
const path = require('path');

class FileService {
  static getUploadDir() {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
  }

  static saveUploadedFile(file) {
    if (!file) return null;

    const uploadDir = this.getUploadDir();
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);
    return filename;
  }

  static getFilePath(filename) {
    return path.join(this.getUploadDir(), filename);
  }

  static fileExists(filename) {
    return fs.existsSync(this.getFilePath(filename));
  }

  static deleteFile(filename) {
    const filepath = this.getFilePath(filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  }

  static getFileContent(filename) {
    const filepath = this.getFilePath(filename);
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf-8');
    }
    return null;
  }

  static getFileUrl(filename) {
    return `/uploads/${filename}`;
  }

  static getAllUploads() {
    const uploadDir = this.getUploadDir();
    if (!fs.existsSync(uploadDir)) {
      return [];
    }
    return fs.readdirSync(uploadDir);
  }
}

module.exports = FileService;
