
/* Depending on small interfaces instead of whole TreeNode - ISP from SOLID */
/* HasChildren<T>
  e.g. <TreeNode>, <TreeColumn> (nested columns), can be used for recursive navigation
*/
/* HasContent<T>,
  e.g. <Task> <Milestone>, <WorkItem>, e.g.
  treeNode.get(Task) to get the contents of given type
*/
