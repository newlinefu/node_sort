const path = require('path')
const fs = require('fs')
const files = require('./lib/write-arrays-in-files')
const http = require('http')

//Колличество файлов массивов
const COUNT_OF_FILES = 7

//Возврат всех массивов из файлов в виде двух массивов (сортированных и несортированных)
function createArraysOfResult(countOfFiles) {

    //Массивы всех несортированных и сортированных массивов из записанных файлов
    const unsortedArrays = new Array(countOfFiles)
    const sortedArrays = new Array(countOfFiles)

    const promiseArray = []

    for(let i = 0; i < COUNT_OF_FILES; i++) {
        promiseArray.push(readArray(path.join(__dirname, 'logs', 'input-arrays', `array_${i}.txt`), i, unsortedArrays))
        promiseArray.push(readArray(path.join(__dirname, 'logs', 'output-arrays', `sorted_array_${i}.txt`), i, sortedArrays))
    }

    //Возврат только после заполения всех массивов
    return Promise.all(promiseArray).then(() => [unsortedArrays, sortedArrays])
}

//Функция прочтения массива из файла
function readArray(location, i, fillableArray) {
    return new Promise(resolve => {
        fs.readFile(
            location,
            'utf-8',
            (err, data) => {
                if(err) throw err

                //Добавление по индексу вследствие ассинхронности
                fillableArray[i] = data
                resolve()
            }
        )
    })
}

//Построение одного блока HTML страницы в текстовом формате
function createHTMLBlock(sortedArray, unsortedArray, index) {
    return `
        <div style="font-size: 25px; padding: 20px; background-color: burlywood; margin: 20px; border-radius: 6px;">
            <h3>Result ${index}</h3>
            <p>
                <span style="letter-spacing: 3px;">${sortedArray}</span> 
                <span style="font-size: 28px;margin: 20px">=></span>
                <span style="letter-spacing: 3px;">${unsortedArray}</span>
            </p>
        </div>
    `
}

//Построение всех блоков в текстовом формате
function createPage(sortedArrays, unsortedArrays) {
    let page = ''

    for(let i = 0; i < sortedArrays.length; i++)
        page += createHTMLBlock(sortedArrays[i], unsortedArrays[i], i)

    return page
}

const server = http.createServer((req, res) => {
    files.writeArraysInFiles(path.join(__dirname, 'logs'), COUNT_OF_FILES)
        .then(() => createArraysOfResult())
        .then(([unsorted, sorted]) => createPage(unsorted, sorted))
        .then(resolve => res.end(resolve))
})

server.listen(
    3000,
    () => console.log('Run')
)


