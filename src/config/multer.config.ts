import multer from 'multer';
import fs from 'fs';

function creatFolder(path:string) {

if (!fs.existsSync(path)) {
  try {
    fs.mkdirSync(path);
    console.log("Folder created successfully!");
  } catch (err) {
    console.error("Error creating folder:", err);
  }
}

}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    console.log(file);
    const ext = file.originalname.split(".")[1]; 

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const allowedTypes = [
      "audio/mpeg", 
      "video/mp4", 
      "application/pdf", 
      "image/jpeg", "image/png", "image/gif"
    ];
    if (!allowedTypes.includes(file.mimetype.toLocaleLowerCase())) {
      return cb(new Error("File type not allowed"), "");
    }

    if(file.mimetype.includes("video")) {
      const iscreated = creatFolder("uploads/videos");
       cb(null, "videos/"+file.originalname.split(".")[0] + "-" +`${uniqueSuffix}.${ext}`); 
    } else if(file.mimetype.includes("audio")) {
      const iscreated = creatFolder("uploads/audios");
       cb(null, "audios/"+file.originalname.split(".")[0] + "-" +`${uniqueSuffix}.${ext}`);
    } else if(file.mimetype.includes("pdf")) {
      const iscreated = creatFolder("uploads/pdf");
       cb(null, "pdf/"+file.originalname.split(".")[0] + "-" +`${uniqueSuffix}.${ext}`);
    } else if(file.mimetype.includes("image")) {
      const iscreated = creatFolder("uploads/images");
       cb(null, "images/"+file.originalname.split(".")[0] + "-" +`${uniqueSuffix}.${ext}`);
    }else{
       return cb(new Error("File type not allowed"), "");
    }
   
  }
});

export const upload = multer({ storage }); 
