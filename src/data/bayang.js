const inverse = (long, lat) => {
    let newArray = [long, lat]
    return [newArray[1], newArray[0]]
}

const polygon = [
    [
        inverse(-7.320673070218166, 112.73033994112734),
        inverse(-7.320951475839246, 112.73245790314928),
        inverse(-7.323178714550526, 112.73199858608429),
        inverse(-7.322811727119326, 112.72993165929176),
        inverse(-7.322811727119326, 112.72993165929176),
    ],
]

export default polygon;
