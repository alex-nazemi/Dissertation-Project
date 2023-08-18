import { firestore } from "../firebaseConfig.js"; 
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

/**
 * @param {string} userId
 * @param {number} preTrainingScore
 * @param {number} postTrainingScore
 */
export const storeUserScore = async (userId, preTrainingScore, postTrainingScore) => {
  try {
    const scoresCollection = collection(firestore, "scores");
    const newScore = {
      userId,
      preTrainingScore,
      postTrainingScore,
      timestamp: new Date(),
    };
    await addDoc(scoresCollection, newScore);
  } catch (error) {
    console.error("Error storing user score: ", error);
  }
};


/**
 * @param {string} userId
 * @returns {Array}
 */
export const fetchUserScores = async (userId) => {
  try {
    const scoresCollection = collection(firestore, "scores");
    const q = query(
      scoresCollection,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    return scores;
  } catch (error) {
    console.error("Error fetching user scores: ", error);
  }
};
