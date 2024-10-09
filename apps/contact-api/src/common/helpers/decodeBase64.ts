import * as fs from 'fs';
const base64ToString = (data: string) => {
    const buff = Buffer.from(data, 'base64');
    const base64data = buff.toString();
    return base64data;
  };
  const getBase64 = async (file: string): Promise<string> => {
      try {
          return Buffer.from(file).toString('base64');
      } catch (error) {
          throw error;
      }
};
const base64ToHex = (base64: string): string => {
  return atob(base64).split("").map((char: string) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)).join("");
};
const decodeBase64 = (data: any): any => {
  try {
  const base64 = data;
  const hexString = base64ToHex(base64);
  return decodeURIComponent(hexString);
  } catch (error) { 
    throw error;
  }
};
export {
  base64ToString,
  getBase64,
  decodeBase64
};
