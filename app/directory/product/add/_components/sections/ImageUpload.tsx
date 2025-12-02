import { ChangeEvent } from "react";
import Image from "next/image";
import { LuPlus } from "react-icons/lu";

interface ImageUploadProps {
    imagePreview?: string;
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ imagePreview, onImageChange }: ImageUploadProps) {
    return (
        <div className="flex justify-center">
            <label className="group cursor-pointer relative w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center" htmlFor="image">
                {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg width="79" height="51" viewBox="0 0 79 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.95425 50.5556H74.378C77.5287 50.5556 79.4105 47.1651 77.6673 44.6291L62.4813 22.5365C61.3081 20.8298 58.9492 20.323 57.1381 21.3888L44.4483 28.8561C42.6763 29.8988 40.3714 29.4386 39.1722 27.8027L26.3142 10.2622C24.6214 7.95293 21.0074 8.16532 19.6167 10.6558L0.479099 44.9283C-0.940405 47.4704 0.964861 50.5556 3.95425 50.5556Z"
                                fill="#B7B7B7"
                                fillOpacity="0.7"
                            />
                            <path d="M56.5679 8.34644C56.5679 12.9561 52.8111 16.6929 48.1768 16.6929C43.5425 16.6929 39.7857 12.9561 39.7857 8.34644C39.7857 3.73683 43.5425 0 48.1768 0C52.8111 0 56.5679 3.73683 56.5679 8.34644Z" fill="#B7B7B7" fillOpacity="0.7" />
                        </svg>

                        <div className="absolute bg-neutral-950 rounded-full text-white p-2 flex items-center justify-center -bottom-5">
                            <LuPlus className="text-xl" />
                        </div>
                    </div>
                )}
                <input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
        </div>
    );
}
