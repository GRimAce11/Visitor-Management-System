import { db } from "../../config/db.firebase";
import { collection, getDocs } from "firebase/firestore";


const getAllData = async (collectionName) => {
    try {
        const firebaseCollection = collection(db, collectionName);
        const dataDetails = await getDocs(firebaseCollection)
        const requestData = dataDetails.docs.map((dataArray) => ({
            ...dataArray.data(),
            id: dataArray.id,
        })
        )
        // console.log("==>",requestData)
        return requestData

    } catch (err) {
        return "Could not fetch data";
    }
}

export default getAllData;