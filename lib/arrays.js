function createRandomArray(len) {
    const obj = {
        len,
        * [Symbol.iterator]() {
            for (let i = 0; i < this.len; i++)
                yield Math.floor(Math.random() * 10)
        }
    }

    return [...obj]
}

module.exports = {
    createRandomArray
}