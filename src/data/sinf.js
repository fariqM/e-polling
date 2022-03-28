const inverse = (long, lat) => {
    let newArray = [long, lat]
    return [newArray[1], newArray[0]]
}

const polygon = [
    [
        inverse(-7.321466539507005, 112.73436279385012),
        inverse(-7.321605742091599, 112.73528142798013),
        inverse(-7.321188134207467, 112.73535798082429),
        inverse(-7.321036276698107, 112.73447124371269),
        inverse(-7.321466539507005, 112.73436279385012),
    ],
]

export default polygon;
