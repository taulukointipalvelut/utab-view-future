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

function elapsed_string (date1, date2) {
    let hour = date1.getHours() - date2.getHours()
    let min = date1.getMinutes() - date2.getMinutes()
    let sec = date1.getSeconds() - date2.getSeconds()
    if (sec < 0) {
        sec += 60
        min -= 1
    }
    if (min < 0) {
        min += 60
        hour -= 1
    }
    let min_str = min < 10 ? '0'+min : min
    let sec_str = sec < 10 ? '0'+sec : sec
    //let prefix = hour === 0 && min === 0 && sec === 0 ? '' : '+'
    return (hour === 0 ? '' : hour + '°')+min_str+'′'+sec_str+'″'
}

function pairs (list1, list2) {
    pairs = []
    for (let e1 of list1) {
        for (let e2 of list2) {
            pairs.push([e1, e2])
        }
    }
    return pairs
}

function count(list, e) {
    let c = 0
    for (let e1 of list) {
        if (e1 === e) {
            c += 1
        }
    }
    return c
}

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


function ordinal (order) {
    let ordinal = ""
    if (order === 1) {
        ordinal = "1st"
    } else if (order === 2) {
        ordinal = "2nd"
    } else if (order === 3){
        ordinal = "3rd"
    } else {
        ordinal = order+"th"
    }
    return ordinal
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
exports.count = count
exports.pairs = pairs
exports.ordinal = ordinal
exports.elapsed_string = elapsed_string
