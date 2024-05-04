

import {addDoc, collection} from "firebase/firestore";
import { db } from "../../config/db.firebase";

const addToFirebase = async (data,collectionName)=>{
    const collectionList = collection(db, collectionName)
    console.log("in db",data);
        try {
            await addDoc(collectionList, data)
            return true
        } catch (e) {
            return e
        }
}
export default addToFirebase