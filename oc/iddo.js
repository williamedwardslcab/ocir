import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();
const documentPath = 'collection/document';

async function updateDocument(transactionBlock) {
  const documentRef = firestore.doc(documentPath);
  await firestore.runTransaction(async (transaction) => {
    const doc = await transaction.get(documentRef);
    if (!doc.exists) {
      throw new Error('Document does not exist!');
    }
    transaction.update(documentRef, transactionBlock(doc.data()));
  });
}

const transactionBlock = (data) => {
  // Example transaction block that increments a 'count' field
  return { count: (data.count || 0) + 1 };
};

updateDocument(transactionBlock)
  .then(() => console.log('Document successfully updated'))
  .catch((error) => console.error('Error updating document:', error));
