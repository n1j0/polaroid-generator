const imageLoader = document.getElementById('imageLoader')
const downloadButton = document.getElementById('downloadButton')
const canvas = document.getElementById('imageCanvas')
const ctx = canvas.getContext('2d')

// nice hack for better resolution
canvas.width = canvas.clientWidth * 4
canvas.height = canvas.clientHeight * 4
ctx.scale(4, 4)

// margin error when "false"
const generateShadow = true

const newImageWidth = 500

const frame = {
    width: 20,
    bottomMargin: 130,
    color: 'white'
}

const shadow = {
    color: '#c1c1c1',
    blur: 15,
    offset: 10
}

const shadowMargin = shadow.offset * 2

const fontSizeOnPolaroid = 40

let fileName = 'image'

imageLoader.addEventListener('change', (e) => handleImage(e.target.files[0]), false)

downloadButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${fileName}-polaroid.png`
    link.click()
})

const handleImage = (rawImage) => {
    fileName = rawImage.name.split('.')[0]
    const reader = new FileReader()
    reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
            const ratio = newImageWidth / img.width
            const newImageHeight = img.height * ratio

            canvas.width = newImageWidth + (frame.width * 2) + (generateShadow ? (shadowMargin * 2) : 0)
            canvas.height = newImageHeight + (frame.width * 2) + frame.bottomMargin + (generateShadow ? (shadowMargin * 2) : 0)

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.save()

            if (generateShadow) {
                ctx.shadowColor = shadow.color
                ctx.shadowBlur = shadow.blur

                ctx.shadowOffsetX = shadow.offset / 2
                ctx.shadowOffsetY = shadow.offset / 2
                ctx.fillStyle = shadow.color
                ctx.fillRect(
                    shadowMargin,
                    shadowMargin,
                    canvas.width - (shadowMargin * 2),
                    canvas.height - (shadowMargin * 2)
                )

                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
                ctx.globalAlpha = 0.3
                ctx.fillRect(
                    shadowMargin,
                    shadowMargin,
                    canvas.width - (shadowMargin * 2),
                    canvas.height - (shadowMargin * 2)
                )

                ctx.restore()
            }

            ctx.fillStyle = frame.color
            ctx.strokeStyle = shadow.color
            ctx.fillRect(
                shadowMargin,
                shadowMargin,
                canvas.width - (generateShadow ? (shadowMargin * 2) : 0),
                canvas.height - (generateShadow ? (shadowMargin * 2) : 0)
            )

            ctx.drawImage(
                img,
                frame.width + (generateShadow ? shadowMargin : 0),
                frame.width + (generateShadow ? shadowMargin : 0),
                newImageWidth,
                newImageHeight
            )
        }
        img.src = String(event.target.result)
    }
    reader.readAsDataURL(rawImage)
}

const isFile = (evt) => {
    return evt.dataTransfer.types.includes('Files')
}

const setDragAndDropStyling = (visibility, opacity, fontSize) => {
    const dropzone = document.querySelector('#dropzone')
    dropzone.style.visibility = visibility
    dropzone.style.opacity = opacity
    document.querySelector('#textnode').style.fontSize = fontSize
}

canvas.addEventListener('click', (e) => {
    const text = prompt('Enter text:')
    if (text) {
        ctx.fillStyle = '#000000'
        ctx.font = `${fontSizeOnPolaroid}px Bradley Hand`
        ctx.textAlign = 'center'
        ctx.fillText(text, canvas.width / 2, canvas.height - frame.bottomMargin / 2 - fontSizeOnPolaroid * 0.5)
    }
})

let lastTarget = null

document.addEventListener('dragenter', function (e) {
    if (isFile(e)) {
        lastTarget = e.target
        setDragAndDropStyling('visible', 1, '48px')
    }
})

document.addEventListener('dragleave', function (e) {
    e.preventDefault()
    if (e.target === document || e.target === lastTarget) {
        setDragAndDropStyling('hidden', 0, '42px')
    }
})

document.addEventListener('dragover', function (e) {
    e.preventDefault()
})

document.addEventListener('drop', function (e) {
    e.preventDefault()
    setDragAndDropStyling('hidden', 0, '42px')
    if (e.dataTransfer.files.length === 1) {
        handleImage(e.dataTransfer.files[0])
    }
})