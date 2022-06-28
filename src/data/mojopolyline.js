const inverse = (long, lat) => {
    let newArray = [long, lat]
    return [newArray[0], newArray[1]]
}

const polyline = [
    inverse(-7.405032093208849, 112.58839898439089),
    inverse(-7.40196794811507, 112.59178929636873),
    inverse(-7.403606417237626, 112.5960808305179),
]

export default polyline;
