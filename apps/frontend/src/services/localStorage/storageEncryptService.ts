import CryptoJS from 'crypto-js';
import { keyFront } from '../../utils/const/backend';
const SECRET_KEY: any = keyFront.KEYFRONT;
const encryptData =(name: string, data: any) => {
    try{
    const encrypted: any = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
    } catch (error) {
    console.log('error encrypt ', error);
    }
  };

const decryptData = (name: string) => {
    try {
    const encrypted: any = localStorage.getItem(name);
    if (!encrypted) { return; }
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
    } catch (error) {
    console.log('error decrypt ', error);
    }
};
const removetData = (name: string) => {
    return localStorage.removeItem(name);
};
export {
    encryptData,
    decryptData,
    removetData
}
