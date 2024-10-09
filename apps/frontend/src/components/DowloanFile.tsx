import { faDownload  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { isGIF, isJPEG, isPDF, isPNG } from '../utils/helpers/typeFile';

interface DownloadFileProps {
  base64: string;
}
const DownloadFile: React.FC<DownloadFileProps> = ({ base64 }) => {
 const validType = (byteArray: any) => {
    if (isJPEG(byteArray)) {
        return "jpeg";
      } else if (isPNG(byteArray)) {
        return "png";
      } else if (isGIF(byteArray)) {
        return "jpg";
      } else if (isPDF(byteArray)) {
        return "pdf";
      } else {
        return "application/octet-stream";
      }
 }
  const downloadFile = (base64: string) => {  
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeType = validType(byteArray);
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url
    link.download = `Presentacion.${mimeType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <FontAwesomeIcon style={{ paddingLeft:'10px', cursor: 'pointer'}} icon={faDownload } onClick={() => downloadFile(base64)} size="lg" />
  );
};
export default DownloadFile;