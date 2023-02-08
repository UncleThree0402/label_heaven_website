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

const mongoController = require('./models/controller')

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
    const datasets = await mongoController.getAllDatasets()
    res.render('datasets/index.ejs', {datasets})
})

app.post('/datasets', async (req, res) => {
    await mongoController.newDatasets(req.body)
    res.redirect('/')
})

app.get('/datasets/new', (req, res) => {
    res.render('datasets/new.ejs')
})

app.get('/datasets/:datasetId', async (req, res) => {
    const datasetId = req.params.datasetId
    const {dataset, videos, videosPercentage} = await mongoController.getDatasetPageById(datasetId)
    res.render('datasets/detail.ejs', {dataset, videos, videosPercentage})
})

app.post('/datasets/:datasetId', async (req, res) => {
    const {videoId} = req.body
    const datasetId = req.params.datasetId
    const res_craw = await fetch('http://localhost:8080/youtube', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({videoId, datasetId: datasetId}),
    })
    const res_json = await res_craw.json()
    res.redirect(`/datasets/${datasetId}`)
})

app.delete('/datasets/:id', async (req, res) => {
    const id = req.params.id
    const state = await mongoController.deleteDataset(id)
    res.redirect('/datasets')
})

app.get('/datasets/:id/class', async (req, res) => {
    const datasetId = req.params.id
    const datasetClasses = await mongoController.getDatasetClasses(datasetId)
    res.json(datasetClasses)
})

app.get('/datasets/:datasetId/download', async (req, res) => {
    const datasetId = req.params.datasetId
    const labels = await mongoController.getDownloadLabel(datasetId)
    for(const ele of labels){
        ele["videoTitle"] += " 婚姻平權"
    }
    const fields = ["comment", "class", "videoTitle"]
    const opts = {fields};
    try {
        const csv = parse(labels, opts);
        await fs.writeFile("dataset.csv", csv, {encoding: 'utf8', excelStrings: true, withBOM: true}, (err) => {
            console.log(err)
        })
        res.download("dataset.csv")
    } catch (err) {
        res.redirect(`/datasets/${datasetId}`)
    }

})

app.get('/labels/:datasetId/:videoId/all', async (req, res) => {
    const datasetId = req.params.datasetId
    const videoId = req.params.videoId
    const labels = await mongoController.getAllLabelsById(datasetId, videoId)
    res.render('comments/detail.ejs', {labels})
})

app.delete('/datasets/:datasetId/:videoId', async (req, res) => {
    const datasetId = req.params.datasetId
    const videoId = req.params.videoId
    await mongoController.deleteVideo(datasetId, videoId)
    res.redirect(`/datasets/${datasetId}`)
})

app.get('/datasets/:datasetId/:videoId/job', async (req, res) => {
    const datasetId = req.params.datasetId
    const videoId = req.params.videoId
    const video = await mongoController.getVideoById(datasetId, videoId)
    res.render('comments/labels.ejs', {video, datasetId: datasetId})
})

app.get('/labels/:datasetId/:videoId/one', async (req, res) => {
    const datasetId = req.params.datasetId
    const videoId = req.params.videoId
    const label = await mongoController.getOneLabelById(datasetId, videoId)
    res.json(label)
})

app.patch('/labels/:labelId', async (req, res) => {
    const label = req.body.className
    const labelId = req.params.labelId
    await mongoController.updateLabelClassByClass(labelId, label)
    res.json({status: true})
})

app.delete('/labels/:labelId', async (req, res) => {
    const {labelId} = req.body
    await mongoController.deleteLabelById(labelId)
    res.json({status: true})
})

//App Listen
app.listen('3000', () => {
    console.log("App listening on port 3000")
})


