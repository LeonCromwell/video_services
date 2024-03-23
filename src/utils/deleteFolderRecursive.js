const fs = require("fs");
const path = require("path");

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const currentPath = path.join(folderPath, file);

      if (fs.lstatSync(currentPath).isDirectory()) {
        // Đệ quy xóa thư mục con
        deleteFolderRecursive(currentPath);
      } else {
        // Xóa tệp
        fs.unlinkSync(currentPath, (err) => {
          if (err) throw err;
          console.log({ err });
          console.log(`Đã xóa tệp: ${currentPath}`);
        });
      }
    });

    // Xóa thư mục chính sau khi xóa tất cả thư mục con và tệp
    fs.rmdirSync(folderPath);
    console.log(`Đã xóa thư mục: ${folderPath}`);
  }
}

module.exports = deleteFolderRecursive;
