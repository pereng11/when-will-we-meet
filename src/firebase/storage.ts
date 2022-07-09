import { connectStorageEmulator, getStorage, ref } from 'firebase/storage';
import app from './index';

const storage = getStorage(app);

const profileImagesRef = ref(storage, 'profile_images');

connectStorageEmulator(storage, 'localhost', 9199);

export { profileImagesRef };

export default storage;
