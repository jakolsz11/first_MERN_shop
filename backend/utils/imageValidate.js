const imageValidate = (images) => {
  let imagesTable = [];
  if(Array.isArray(images)){
    imagesTable = images;
  }
  else{
    imagesTable.push(images);
  }

  if(imagesTable.length > 5){
    return { error: "Send only 5 images at once"};
  }

  for(let image of imagesTable){
    if(image.size > 4194304){ //4mb
      return { error: "Size to large (above 4 MB)"};
    }
    
    const filetypes = /jpg|jpeg|png/;
    const mimetype = filetypes.test(image.mimetype);
    if(!mimetype){
      return { error: "Incorrect mime type (should be jpg, jpeg or png)"};
    }
  }
  return { error: false};
};

module.exports = imageValidate;