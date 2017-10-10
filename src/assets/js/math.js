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

function query_from_obj(obj) {
    return Object.keys(obj).map(key => key+'='+obj[key]).join('&')
}

function capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function sum (arr) {
    return arr.reduce((a, b) => a + b, 0)
}

function sum_bool (arr) {
    return arr.reduce((a, b) => (a ? 1 : 0) + (b ? 1 : 0), 0)
}

function average (arr) {
    if (arr.length === 0) {
        return 0
    } else {
        return sum(arr)/arr.length
    }
}
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
exports.sum = sum
exports.sum_bool = sum_bool
exports.average = average
exports.capitalize = capitalize
exports.query_from_obj = query_from_obj
