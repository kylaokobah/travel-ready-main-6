import db from "..";
import { setDoc, doc, collection, getDocs, getDoc, query, where, Timestamp, orderBy, limit, startAfter, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { storage } from "..";
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { TravelHistoryData, TravelHistoryAddFormData } from 'types';
import { addUserTravelHistory, delUserTravelHistory } from "./user";
const COLLECTION_NAME = "travel_histories";

export const getListTravelHistory = async (list: string[], lastDate: any, count: number): Promise<Array<TravelHistoryData>> => {
    const q = lastDate == null ?
        query(collection(db, COLLECTION_NAME), where("id", "in", list), orderBy("createAt", "desc"), limit(count))
        : query(collection(db, COLLECTION_NAME), where("id", "in", list), orderBy("createAt", "desc"), startAfter(lastDate), limit(count));

    const travelHistoriesSnapshot = await getDocs(q);
    const data: Array<any> = [];
    travelHistoriesSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    })
    return travelHistoriesSnapshot.docs.length > 0 ? data as Array<TravelHistoryData> : [];
}

export const getListTravelHistoryByTag = async (tag: string): Promise<TravelHistoryData[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("tags", "array-contains", tag.toLowerCase()));

    const travelHistoriesSnapshot = await getDocs(q);
    let data: Array<any> = [];
    travelHistoriesSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    });

    data.sort((one, other) => {
        return other.likes.length - one.likes.length || other.rating - one.rating;
    })

    return travelHistoriesSnapshot.docs.length > 0 ? data as TravelHistoryData[] : [];
}

export const getListTravelHistoryByLike = async (uid: string): Promise<TravelHistoryData[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("likes", "array-contains", uid), orderBy("createAt", "desc"));

    const travelHistoriesSnapshot = await getDocs(q);
    let data: Array<any> = [];
    travelHistoriesSnapshot.docs.forEach((_data) => {
        data.push({ ..._data.data() });
    });

    return travelHistoriesSnapshot.docs.length > 0 ? data as TravelHistoryData[] : [];
}


export const getSingleTravelHistory = async (id: string): Promise<TravelHistoryData | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);

    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as TravelHistoryData : null;
}

export const setTravelHistory = async (data: TravelHistoryAddFormData) => {
    const imageRef = ref(storage, `/travel_histories/${data.id}/1.jpg`);

    // @ts-ignore : data.imageFile is not null. the value is checked before calling setTravelHistory function.
    await uploadBytes(imageRef, data.imageFile).catch((error) => {
        alert(error);
    })

    await getDownloadURL(ref(storage, `/travel_histories/${data.id}/1.jpg`)).then(async (url) => {
        await setDoc(doc(db, COLLECTION_NAME, data.id), {
            id: data.id,
            uid: data.uid,
            photoURL: data.photoURL,
            createAt: Timestamp.now(),
            country: data.country,
            site: data.site.toLowerCase(),
            description: data.description,
            tags: data.tags,
            image: url,
            rating: data.rating,
            likes: []
        });
    }).catch((error) => {
        alert(error);
    });

    // save id to user.
    await addUserTravelHistory(data);
}

export const delTravelHistory = async (uid: string, postData: TravelHistoryData) => {

    await deleteDoc(doc(db, COLLECTION_NAME, postData.id));

    const imageRef = ref(storage, `/travel_histories/${postData.id}/1.jpg`);
    deleteObject(imageRef).then().catch(() => {
        alert("Fail to delete image due to internal error.");
    });

    await delUserTravelHistory(uid, postData);
}

export const updateTravelHistory = async (id: string, data: TravelHistoryAddFormData) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        description: data.description,
        tags: data.tags,
        rating: data.rating,
    });
}

export const updateTravelHistoryLikes = async (uid: string, data: TravelHistoryData) => {
    const docRef = doc(db, COLLECTION_NAME, data.id);
    if (data.likes.some((val) => val === uid)) { // remove uid from likes
        await updateDoc(docRef, {
            likes: arrayRemove(uid),
        })
    } else { // add uid from likes
        await updateDoc(docRef, {
            likes: arrayUnion(uid),
        })
    }
}