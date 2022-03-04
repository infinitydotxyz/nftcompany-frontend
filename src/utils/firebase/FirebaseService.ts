// import { db } from './firebaseUtils';

// class DatabaseService {
//   collection;

//   // Specify 'authors', 'categories', or 'books' as collection name
//   constructor(collectionName: string) {
//     this.collection = db.collection(collectionName);
//   }

//   // returns list of records as an array of javascript objects
//   getAll = async () => {
//     const snapshot = await this.collection.get();
//     return snapshot.docs.map((doc) => {
//       return {
//         id: doc.id, // append document id to each document
//         ...doc.data()
//       };
//     });
//   };

//   // returns a single document in object format
//   getOne = async ({ queryKey }: any) => {
//     const { id } = queryKey[1];
//     if (!id) return; // entity form is in create mode
//     const snapshot = await this.collection.doc(id).get();
//     return snapshot.data();
//   };

//   // resolve a relation, returns the referenced document
//   getReference = async (documentReference: any) => {
//     const res = await documentReference.get();
//     const data = res.data();

//     if (data && documentReference.id) {
//       data.uid = documentReference.id;
//     }

//     return data;
//   };

//   // save a new document in the database
//   create = async (data: any) => {
//     return await this.collection.add(data);
//   };

//   // update an existing document with new data
//   update = async (id: string, values: any) => {
//     return await this.collection.doc(id).update(values);
//   };

//   // delete an existing document from the collection
//   remove = async (id: string) => {
//     return await this.collection.doc(id).delete();
//   };
// }
