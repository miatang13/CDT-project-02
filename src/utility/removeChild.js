if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) {
        console.warn(
          "Cannot remove a child from a different parent",
          child,
          this
        );
      }
      // return child;
      console.log(child);
      var c = document.getElementById(child.id);
      c.parentNode.removeChild(c);
      return;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.warn(
          "Cannot insert before a reference node from a different parent",
          referenceNode,
          this
        );
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}
