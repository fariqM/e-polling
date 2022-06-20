const inverse = (long, lat) => {
    let newArray = [long, lat]
    return [newArray[1], newArray[0]]
}

const poyligon = [
    [
        inverse(-7.40103387459119, 112.57948341582006),
        inverse(-7.4079102054863535, 112.58607398528322),
        inverse(-7.397905418405895, 112.59572557722315),
        inverse(-7.394219386925165, 112.59332048797886),
        inverse(-7.40103387459119, 112.57948341582006),
    ],
]

export default poyligon;
