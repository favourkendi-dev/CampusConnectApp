import { db, doc, getDoc, getDocs, query, where, collection } from '../firebase/config';

export const getUserById = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getUsersByIds = async (userIds) => {
  const users = [];
  for (const id of userIds) {
    const user = await getUserById(id);
    if (user) users.push(user);
  }
  return users;
};

export const searchUsersByName = async (searchTerm, limit = 20) => {
  const q = query(
    collection(db, 'users'),
    where('displayName', '>=', searchTerm),
    where('displayName', '<=', searchTerm + '\uf8ff')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).slice(0, limit);
};

export const batchUpdate = async (updates) => {
  // Firestore batched writes
  const batch = writeBatch(db);
  updates.forEach(({ ref, data }) => {
    batch.update(ref, data);
  });
  await batch.commit();
};

export const createTimestamp = () => {
  return new Date().toISOString();
};

export const isDocumentExists = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};