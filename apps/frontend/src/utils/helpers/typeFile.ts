const isJPEG = (buffer: any) =>  {
    return buffer.length > 2 &&
           buffer[0] === 0xFF &&
           buffer[1] === 0xD8 &&
           buffer[2] === 0xFF;
  }
  const isPNG = (buffer: any) => {
    return buffer.length > 7 &&
           buffer[0] === 0x89 &&
           buffer[1] === 0x50 &&
           buffer[2] === 0x4E &&
           buffer[3] === 0x47 &&
           buffer[4] === 0x0D &&
           buffer[5] === 0x0A &&
           buffer[6] === 0x1A &&
           buffer[7] === 0x0A;
  }
  const isGIF = (buffer: any) => {
    return buffer.length > 3 &&
           buffer[0] === 0x47 &&
           buffer[1] === 0x49 &&
           buffer[2] === 0x46 &&
           buffer[3] === 0x38;
  }
  const isPDF = (buffer: any)=> {
    return buffer.length > 3 &&
           buffer[0] === 0x25 &&
           buffer[1] === 0x50 &&
           buffer[2] === 0x44 &&
           buffer[3] === 0x46;
  }
  export  {
    isJPEG,
    isPNG,
    isGIF,
    isPDF
  }