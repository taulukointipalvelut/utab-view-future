function disjoint (list1, list2) {
    return list1.every(e1 => !list2.includes(e1))
}
/*
function disjoint_loose (list1, list2) {
    if (list1 === null || list2 === null) {
        return true
    } else {
        return list1.every(e1 => !list2.includes(e1))
    }
}*/

function range(len) {
    return [...Array(len).keys()]
}

function common (list1, list2) {
    return list1.filter(e1 => list2.includes(e1))
}

//exports.disjoint_loose = disjoint_loose
exports.disjoint = disjoint
exports.common = common
exports.range = range
