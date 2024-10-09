const getBase64 = (file: any) => {
    const codeToBase64 = new Promise((resolve, reject) => {
        try {
            const dataBlob = new Blob([file], { type: 'text/plain' });
            let baseURL: any= "";
            let reader = new FileReader();
            reader.readAsDataURL(dataBlob);
            reader.onload = () => {
                baseURL = String(reader.result).split(',')[1];
                resolve(baseURL);
            };
            } catch (error) {
                reject(error);
            }
});
return codeToBase64;
};

const codeBase64Image = (file: any) => {
  const codeToBase64 = new Promise((resolve, reject) => {
      try {
        console.log('file', file);
          const dataBlob = new Blob([file], { type: 'image/html' });
          let reader = new FileReader();
          let baseURL: any= "";
          reader.readAsDataURL(dataBlob);
          reader.onload = () => {
              baseURL = reader.result;
              resolve(baseURL);
          };
          } catch (error) {
              reject(error);
          }
});
return codeToBase64;
};
const base64ToHex = (base64: string): string => {
  return atob(base64).split("").map((char: string) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)).join("");
};
const decodeBase64 = (data: any): any => {
  const base64 = data;
  const hexString = base64ToHex(base64);
  return decodeURIComponent(hexString);
};
export {
     getBase64,
     decodeBase64,
     codeBase64Image
};