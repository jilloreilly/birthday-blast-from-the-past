
const key = 'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'


function getVideo() {
    // Youtube API Key
    let movie = UPDATE
    const key = 'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'
    // Youtube query url
    let queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movie}&key=${key}`
    // console.log(queryURL)

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console log to ensure correct item selected
            console.log(data)
            console.log(`Video Data: ${data.items[0].id.videoId}`);
            // variable to hold the first videos specific video ID
            let videoId = data.items[0].id.videoId
            // const  = $('#card-title').text(`Location: ${data[0].name} (${dayjs().format('MMMM D, YYYY')})`)
            createFrame(videoId)
        }
        )
}



//function to add video to page
function createFrame(videoId) {

    let srcEl = `http://www.youtube.com/embed/${videoId}?enablejsapi=1`
    console.log(srcEl)
    let videoFrame = `<iframe id="player" type="text/html" width="640" height="390"
    src="http://www.youtube.com/embed/${videoId}?enablejsapi=1"
    frameborder="0"></iframe>`

    let iFramePlayer = $('#youtube-trailer').html(videoFrame)
}

getVideo()

