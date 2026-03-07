import axios from "axios";

const uploadFile = async(file , type)=>{
    let url = import.meta.env.VITE_CLOUDINARY_CLOUD_URL;
    if(type === "image"){
      url += "image/upload";
    }else if(type === "video"){
      url += "video/upload";
    }
    const formData = new FormData();
    formData.append('file',file);
    formData.append("upload_preset","kqxmnmum");

    const res = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);
    return res;
}

export default uploadFile;