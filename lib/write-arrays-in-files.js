const fs = require('fs')
const path = require('path')
const arrays = require('./arrays')

//Функция записи всех массивов по файлам
function writeArraysInFiles(locationOfDirs, countOfFiles) {

    //Создание первой папки (с изначальными массивами)
    return mkDir(locationOfDirs, 'input-arrays')

        //Создание второй папки (с сортированными массивами)
        .then(() => mkDir(locationOfDirs, 'output-arrays'))
        .then(() => {
            const promiseArray = []
            for (let i = 0; i < countOfFiles; i++) {
                const arrayFilePath = path.join(locationOfDirs, 'input-arrays', `array_${i}.txt`)

                //Сначала создание Promise для записи сгенерированного массива в файл
                const writePromise = writeArrayToFile(arrays.createRandomArray(8), arrayFilePath)

                    //После записи чтение записанных данных из файла сгенерированного массива
                    .then(() => new Promise(resolve => {
                            fs.readFile(
                                path.join(locationOfDirs, 'input-arrays', `array_${i}.txt`),
                                'utf-8',
                                (err, data) => {
                                    if (err) throw err

                                    //После чтения запись в новый файл отсортированного массива
                                    writeArrayToFile(
                                        data.split(',').sort((x, y) => x - y),
                                        path.join(locationOfDirs, 'output-arrays', `sorted_array_${i}.txt`)
                                    ).then(() => resolve())
                                }
                            )
                        })
                    )
                promiseArray.push(writePromise)
            }
            return Promise.all(promiseArray)
        })
}

//Обертка Promise над fs.mkdir
function mkDir(location, name) {
    return new Promise(resolve => {
        fs.mkdir(
            path.join(location, name),
            err => resolve()
        )
    })
}

function writeArrayToFile(array, location) {
    return new Promise((resolve, reject) => {
        fs.writeFile(
            location,
            array,
            err => {
                if (err) reject(err)
                else resolve()
            }
        )
    })
}

module.exports = {
    writeArraysInFiles
}