export class FirestoreTreeBackend {

  /// https://firebase.google.com/docs/firestore/query-data/index-overview

  /// Maximum number of index entries for each document
  //
  // 40,000
  //
  // The number of index entries is the sum of the following for a document:
  //
  // The number of single-field index entries
  // The number of composite index entries
  // To see how Cloud Firestore turns a document and a set of indexes into index entries, see this index entry count example.

  // Note: You can have at most one array field per composite index.

  // // in and == clauses use the same index
  // citiesRef.where("country", "in", ["USA", "Japan", "China"])
  //          .where("population", ">", 690000)

  // «You can perform range (<, <=, >, >=) or not equals (!=) comparisons only on a single field,
  // and you can include at most one array-contains or array-contains-any clause in a compound query:»
  // https://firebase.google.com/docs/firestore/quotas

  /// Considerations:
  /*
  * - first very good and optimal support for 1-to-many; as this is the most frequent case;
  *   - could even have something like parent2Id, parentCount
  * - though Learn-items should be able to be in multiple categories
  * - plan-for-today would make tasks be in milestones / long-term-plans and in day-plans
  *
  * parentIds - contains id
  *  - && owner === userId ;;; or public
  *
  * per-user sharing could be a separate subfield, e.g. `whoCanRead.<userId>` == true`; up to 40k indexes - 40 thousand separate users to whom something was shared
  *  -- BUT: 200 - Maximum number of composite indexes for a database
  * -- and composite indexes have to be added manually!
  * -- but I could make my own fake composite indexes, e.g. canRead_parentItemId_UserId
  *
  * back to parent1, parent2 / owner, owner2
  *
  * worry about multi-user later ---> can always write little script that converts format
  * premature performance optimization
  *
  * === DO think about public
  * * owner = _public_ -> maybe better public = true, so that e.g. Vianey and I can create public items - distinguishing who created
  * then still state = published (vs state = draft), even "beta" for more daring users for early-access, or `>= "010_beta"`
  *
  * ===== other consideration: aspects (e.g. cross-cutting concerns) : could be just a node (reification) without title,
  *    with id === parentItemId__aspect_aspectId, and `aspect` field = "aspectId"
  *   - aspects might have condition on them, on which class(es) they can be applied
  *   - aspects are kinda similar to class fields
  *   - E.g. category: Learning German -> aspect: courtesy expressions; then I can learn courtesy expressions in e.g. Portuguese, Russian, for Quiz or filter
  *
  * ==== !!! quick exploration into the fake (manual) compound indexes:
  * childReadAccess contains-any [
  *    aParentItemId__myUserId,
  *    aParentItemId__public
  * ]
  * or `parentAndUsersWhoCanRead`
  *
  * could expand this into recursive query:
  *
  * childReadAccessRecursive contains-any [
  *    aParentItemId__myUserId,
  *    aParentItemId__public
  * ]
  * can this cause combinatorial explosion?
  * 5 users x 5 parents = 25 entries, but only querying 1 or 2
  *
  *
  * ====== TODO: think of case where a user wants to privately add a public (or someone else's) non-writable-by-them item to their own category
  *         ---> a kind of "symlink" item object would be needed
  *     And opposite situation in which a user wants to privately add their own item to public non-writable-by-them category (this is a bit more fancy - like overlays, inheritance)
  *       - maybe security rules can handle preventing setting a parent that user doesn't have permission to modify
  *
  * ====== Considerations about editing conflicts on parents array:
  *   * the array could just be for indexed-query purposes; while this info could be also stored in a map like inclusions:
  *     { parentId: { <inclusionData (or just `true`) > }
  *
  * */
}
