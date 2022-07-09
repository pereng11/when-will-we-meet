import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { profileImagesRef } from '../firebase/storage';

const uploadProfileImage = async (file: File) => {
  try {
    const currTime = Math.floor(new Date().getUTCMilliseconds() * 10000000);
    const imageRef = ref(profileImagesRef, `${file.name}${currTime}`);
    const snapShot = await uploadBytes(imageRef, file);
    const imgURL = await getDownloadURL(imageRef);
    return imgURL;
  } catch (err) {
    console.log('프로필 이미지 업로드에 실패하였습니다', err);
  }
};

const getProfileImageURL = async (filePath: string) => {
  try {
    const imageRef = ref(profileImagesRef, filePath);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (err) {
    console.log('프로필 이미지 URL다운로드에 실패하였습니다', err);
  }
};

export { uploadProfileImage };
