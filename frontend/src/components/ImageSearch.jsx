import React, {useState} from 'react'
import { Search, Loader2, LogIn, LogOut } from 'lucide-react';

const ImageSearch = ({onLogout}) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null); 
    const [similarImages, setSimilarImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        //console.log(preview)
        
    }

    const BASE_URL = "http://localhost:8000/images/";

    const handleSearch = async (e) => {
        //let data = null;
        //console.log(selectedFile);
        e.preventDefault();
        setLoading(true);''
        setError('');
        setSimilarImages([]);   

        const authToken = localStorage.getItem('authToken');
        //console.log("authToken: ", authToken)


        if(!selectedFile) {
            alert("Please select a file");
            setLoading(false);
            return;
        }
        // prepare the form data
        const formData = new FormData();
        formData.append('file', selectedFile);


        // create the Authorization header for Basic Auth
        //const credentials = `${username}:${password}`; // credentials string is username:password
        //const encodedCredentials = btoa(credentials); // encode the credentials using the btoa function
        //const authHeader = `Basic ${encodedCredentials}`; // create the Authorization header
        //formData.append('Authorization', authHeader); 

        try {
            const response = await fetch('http://localhost:8000/search-image/', {
                /*headers: {
                    'Content-Type': 'multipart/form-data'
                }, */
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData,

            });
            if (!response.ok) {
                if (response.status === 401) {
                    //onLogout();
                    throw new Error("Authentication failed. Please check your username and password");
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || 'An unkown error occurred');
                // handle other non-ok responses
            }

            const data = await response.json();
            setSimilarImages(data.similar_images);
            //setSimilarImages(await response.json());
            //console.log(await response.json());
            //console.log(similarImages);
        } catch(error) {
            setError(error.message);
            console.error("Error searching for images", error);
            alert('Failed to search for similar images. ');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="flex justify-center items-center gap-2">
            <h1 className="text-xl text-center p-4">Reverse Search Image</h1>
            <button
                onClick={onLogout}
                className=""
            >
                <LogOut className="" /> Logout
            </button>
        </div>       
        <form>
            <div className="p-2 text-center">
                <label htmlFor="searchFile" className="italic p-4"> Upload an image to find similar ones</label>
                <input type="file" accept=".jpg, .jpeg, .png, .gif" name="searchFile" id="searchFile" onChange={handleFileChange} className="px-4 outline bg-blue-200" />
                {preview && (
                    <div className="text-start italic text-lg p-2">
                        <h2>Image Preview</h2>
                        <img src={preview} alt="preview" className="object-cover object-center w-100 h-100 rounded-lg" />
                    </div>
                )}            
            </div>
            <div className="text-center">
                <input type="button" value="Search Similar Images" onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded" />
                { loading ? (
                    <Loader2 className="" />
                ): (
                    <Search className="" />
                )
                }
                { loading? 'Searching...': 'Search for similar Images'}

            </div>
        </form>
        { error && (
            <div className="bg-red-900 bg-opacity-30 p-4 rounded-md text-red-300 text-center">
                {error}
            </div>
        )}
        
        {similarImages.length > 0 && (
            <div>
                <h2 className="text-2xl font-roboto italic text-center pt-4 pb-4">Similar Images Found:</h2>
                <div className="grid grid-cols-5 gap-2 mx-4">
                    { similarImages.map((image, index) => (
                        <img
                            key={index}
                            src={`${BASE_URL}${image.image_path}`}
                            alt={`Similar Image ${index + 1}`} 
                            className="object-cover object-center w-50 h-50 rounded-lg p-2"
                        />
                        
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}

export default ImageSearch;
