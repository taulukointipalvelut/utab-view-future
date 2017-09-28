function disjoint (list1, list2) {
    return list1.every(e1 => !list2.includes(e1))
}

exports.disjoint = disjoint
