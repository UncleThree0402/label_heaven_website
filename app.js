const express = require('express')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const morgan = require('morgan')
const {parse} = require('json2csv');
const fs = require('fs').promises

const app = express()

//Connect To Database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/label-heaven', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Database connected")
})

const Datasets = require('./models/datasets')
const Videos = require('./models/videos')
const Labels = require('./models/labels')
const Comments = require('./models/comments')

// App Use
app.use(methodOverride("_method"))
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//App Engine
app.engine('ejs', ejsMate)

//App Set
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Middleware
app.use(morgan('dev'))

//Route
app.get('/', (req, res) => {
    res.redirect('/datasets')
})

app.get('/datasets', async (req, res) => {
    const datasets = await Datasets.find({})
    res.render('datasets/index.ejs', {datasets})
})

app.post('/datasets', async (req, res) => {
    const dataset = new Datasets(req.body)
    await dataset.save()
    res.redirect('/')
})

app.get('/datasets/new', (req, res) => {
    res.render('datasets/new.ejs')
})

app.get('/datasets/:id', async (req, res) => {
    const dataset = await Datasets.findById(req.params.id)
    const videos = await Videos.find({datasetId: req.params.id})
    let lable

    const count = async () => {
        const labelcount = {}
        for (let video of videos) {
            let bufferOne
            let bufferTwo

            do {
                await Labels.count({
                    isLabeled: true,
                    datasetId: req.params.id,
                    videoId: video.videoId
                }, function (err, count) {
                    bufferOne = count
                }).clone()
            } while (typeof bufferOne !== 'number')

            do {
                await Labels.count({
                    datasetId: req.params.id,
                    videoId: video.videoId
                }, function (err, count) {
                    bufferTwo = count
                }).clone()
            } while (typeof bufferTwo !== 'number')


            labelcount[`${video.videoId}`] = Math.floor((bufferOne / bufferTwo) * 100)
        }
        return labelcount
    }

    lable = await count()
    res.render('datasets/detail.ejs', {dataset, videos, labelcount: lable})
})

app.post('/datasets/:id', async (req, res) => {
    const {videoId} = req.body
    const res_craw = await fetch('http://localhost:8080/youtube', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({videoId, datasetId: req.params.id}),
    })
    const res_json = await res_craw.json()
    res.redirect(`/datasets/${req.params.id}`)
})

app.delete('/datasets/:id', async (req, res) => {
    const id = req.params.id
    await Datasets.deleteMany({_id: id})
    await Labels.deleteMany({datasetId: id})
    await Videos.deleteMany({datasetId: id})
    res.redirect('/datasets')
})

app.get('/datasets/:id/info', async (req, res) => {
    const dataset = await Datasets.findById(req.params.id)
    res.json(dataset)
})

app.get('/datasets/:id/download', async (req, res) => {
    const dataset = await Labels.find({datasetId: req.params.id, isLabeled: true}, {
        comment: 1,
        class: 1,
        videoTitle: 1,
        _id: 0
    })
    const fields = ["comment", "class", "videoTitle"]
    const opts = {fields};
    try {
        const csv = parse(dataset, opts);
        await fs.writeFile("dataset.csv", csv, {encoding: 'utf8', excelStrings: true, withBOM: true}, (err) => {
            console.log(err)
        })
        res.download("dataset.csv")
    } catch (err) {
        res.redirect(`/datasets/${req.params.id}`)
    }

})

app.get('/datasets/:datasetId/:videoId', async (req, res) => {
    const labels = await Labels.find({datasetId: req.params.datasetId, videoId: req.params.videoId})
    res.render('comments/detail.ejs', {labels})
})

app.delete('/datasets/:datasetId/:videoId', async (req, res) => {
    await Labels.deleteMany({datasetId: req.params.datasetId, videoId: req.params.videoId})
    await Comments.deleteMany({videoId: req.params.videoId})
    await Videos.deleteMany({datasetId: req.params.datasetId, videoId: req.params.videoId})
    res.redirect(`/datasets/${req.params.datasetId}`)
})

app.get('/datasets/:datasetId/:videoId/job', async (req, res) => {
    const video = await Videos.findOne({datasetId: req.params.datasetId, videoId: req.params.videoId})
    res.render('comments/labels.ejs', {video, datasetId: req.params.datasetId})
})

app.get('/labels/:datasetId/:videoId', async (req, res) => {
    const dataset = await Labels.findOne({
        isLabeled: false,
        datasetId: req.params.datasetId,
        videoId: req.params.videoId
    })
    res.json(dataset)
})

app.post('/labels/:labelId', async (req, res) => {
    const {className} = req.body
    const re = await Labels.findByIdAndUpdate(req.params.labelId, {$set: {class: className, isLabeled: true}})
    res.json({status: true})
})

app.delete('/labels/:labelId', async (req, res) => {
    const {labelId} = req.body
    await Labels.findByIdAndDelete(labelId)
    res.json({status: true})
})

//App Listen
app.listen('3000', () => {
    console.log("App listening on port 3000")
})


