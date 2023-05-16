import React from "react";
import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";

export default function UploadImage({ setImagesFunc }) {
  const tailwindStyle = {
    button:
      "flex ml-10 mt-2 flex-row items-center justify-center px-2 text-white rounded-md flex-1 bg-blue-900 w-1/4",
    btnRemove:
      "flex ml-10 mt-2 flex-row items-center justify-center px-2 text-white rounded-md flex-1 bg-red-900 w-1/4",
    btnWrapper: "flex flex-row items-center justify-center mb-2",
    mainWrapper: " bg-[#f6f9fe] ",
    imageItem: "flex mt-2 mb-2",
    addOverFlow: "overflow-x-scroll",
    imgWrapper: "flex flex-row  ",
    imageStyling: "w-[300px] h-[182px] ml-4",
  };
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("Image Data => ", imageList, addUpdateIndex);
    setImages(imageList);
    setImagesFunc(imageList);
  };
  const style = {
    imageItem: {
      display: "flex",
      flexDirection: "row",
      margin: "10px 0",
      width: 120,
      minHeight: 120,
      maxHeight: "auto",
      float: "left",
      margin: 3,
      padding: 3,
    },
  };
  return (
    <div className={tailwindStyle.mainWrapper}>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpeg","jpg","png"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div>
            <div className={tailwindStyle.btnWrapper}>
              <button
                className={tailwindStyle.button}
                onClick={onImageUpload}
                {...dragProps}
              >
                Upload Image
              </button>
              &nbsp;
              {imageList.length > 0 && (
                <button
                  onClick={onImageRemoveAll}
                  className={tailwindStyle.btnRemove}
                >
                  Remove all images
                </button>
              )}
            </div>

            <div className={tailwindStyle.addOverFlow}>
              <div className={tailwindStyle.imgWrapper}>
                {imageList.map((image, index) => (
                  <div key={index} className={style.imageItem}>
                    <div className="flex flex-row justify-center items-center mt-2">
                      <img
                        src={image.data_url}
                        className={tailwindStyle.imageStyling}
                      />
                    </div>
                    <div className={tailwindStyle.btnWrapper}>
                      <button
                        className={tailwindStyle.button}
                        onClick={() => onImageUpdate(index)}
                      >
                        <p className="flex-1">Update</p>
                      </button>

                      <button
                        className={tailwindStyle.btnRemove}
                        onClick={() => onImageRemove(index)}
                      >
                        <p className="flex-1">Remove</p>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
