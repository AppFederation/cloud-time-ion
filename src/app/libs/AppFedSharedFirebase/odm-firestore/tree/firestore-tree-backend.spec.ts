import { FirestoreTreeBackend } from './firestore-tree-backend';

describe('FirestoreTreeBackend', () => {
  it('should create an instance', () => {
    expect(new FirestoreTreeBackend()).toBeTruthy();
  });
});
