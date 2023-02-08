const Datasets = require('./datasets')
const Videos = require('./videos')
const Labels = require('./labels')
const Comments = require('./comments')


const getDatasetPageById = async (datasetId) => {
    try {
        const dataset = await Datasets.findById(datasetId)
        const videos = await Videos.find({datasetId: datasetId})
        const videosPercentage = await getVideoPercentage(datasetId, videos)
        return {dataset, videos, videosPercentage}
    } catch (e) {
        return false
    }
}

const getDatasetClasses = async (datasetId) => {
    const dataset = await Datasets.findById(datasetId)
    return {classes: dataset.class}
}

const getAllDatasets = async () => {
    try {
        return await Datasets.find({})
    } catch (e) {
        return false
    }
}

const newDatasets = async (data) => {
    try {
        const dataset = await new Datasets(data)
        await dataset.save()
    } catch (e) {
        return false
    }

}

const deleteDataset = async (datasetId) => {
    try {
        await Datasets.deleteMany({_id: datasetId})
        await Labels.deleteMany({datasetId: datasetId})
        await Videos.deleteMany({datasetId: datasetId})
    } catch (e) {
        return false
    }
    return true
}

const deleteVideo = async (datasetId, videoId) => {
    try {
        await Labels.deleteMany({datasetId: datasetId, videoId: videoId})
        await Comments.deleteMany({videoId: videoId})
        await Videos.deleteMany({datasetId: datasetId, videoId: videoId})
        return true
    } catch (e) {
        return false
    }
}

const getVideoPercentage = async (datasetId, videos) => {
    try {
        const labelcount = {}
        for (let video of videos) {
            let bufferOne
            let bufferTwo

            do {
                await Labels.count({
                    isLabeled: true,
                    datasetId: datasetId,
                    videoId: video.videoId
                }, function (err, count) {
                    bufferOne = count
                }).clone()
            } while (typeof bufferOne !== 'number')

            do {
                await Labels.count({
                    datasetId: datasetId,
                    videoId: video.videoId
                }, function (err, count) {
                    bufferTwo = count
                }).clone()
            } while (typeof bufferTwo !== 'number')

            labelcount[`${video.videoId}`] = Math.floor((bufferOne / bufferTwo) * 100)
        }
        return labelcount
    } catch (e) {
        return false
    }

}

const getVideoById = async (datasetId, videoId) => {
    try {
        return await Videos.findOne({datasetId: datasetId, videoId: videoId})
    } catch (e) {
        return false
    }

}

const getAllLabelsById = async (datasetId, videoId) => {
    try {
        return await Labels.find({datasetId: datasetId, videoId: videoId})
    } catch (e) {
        return false
    }
}

const getOneLabelById = async (datasetId, videoId) => {
    try {
        return await Labels.findOne({
            isLabeled: false,
            datasetId: datasetId,
            videoId: videoId
        })
    } catch (e) {
        return false
    }

}

const updateLabelClassByClass = async (labelId, label) => {
    try {
        return await Labels.findByIdAndUpdate(labelId, {$set: {class: label, isLabeled: true}})
    } catch (e) {
        return false
    }
}

const deleteLabelById = async (labelId) => {
    try {
        await Labels.findByIdAndDelete(labelId)
    } catch (e) {
        return false
    }
}

const getDownloadLabel = async (datasetId) => {
    try {
        return await Labels.find({datasetId: datasetId, isLabeled: true}, {
            comment: 1,
            class: 1,
            videoTitle: 1,
            _id: 0
        })
    } catch (e) {
        return false
    }

}

module.exports = {
    deleteDataset: deleteDataset,
    getVideoPercentage: getVideoPercentage,
    getDatasetClasses: getDatasetClasses,
    getDatasetPageById: getDatasetPageById,
    deleteVideo: deleteVideo,
    getVideoById: getVideoById,
    getAllDatasets: getAllDatasets,
    newDatasets: newDatasets,
    getDownloadLabel: getDownloadLabel,
    getAllLabelsById: getAllLabelsById,
    updateLabelClassByClass: updateLabelClassByClass,
    deleteLabelById: deleteLabelById,
    getOneLabelById: getOneLabelById
}