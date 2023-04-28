main = () => {
    let video = document.querySelector("video")

    let canvas = document.querySelector("canvas")
    let ctx = canvas.getContext("2d")
    ctx.font = "26px monospace"
    ctx.fillStyle = "green"
    let w = canvas.getAttribute("width")
    let h = canvas.getAttribute("height")

    let start = document.querySelector("#start")
    let pause = document.querySelector("#pause")
    let reset = document.querySelector("#reset")

    let constraints = {
        audio : false,
        video : {
            width : w,
            height : h,
            facingMode : "user",
        },
    }

    let interval = 25

    mobilenet.load()
        .then((model) => {
            console.log("Model Loaded") 
            section_1.hidden = true
            section_2.hidden = false

            start.addEventListener("click", () => {
                navigator.mediaDevices.getUserMedia(constraints)
                    .then((stream) => {
                        video.srcObject = stream
                        let si = setInterval(() => {
                            ctx.drawImage(video, 0, 0, w, h)
                            
                            model.classify(canvas)
                                .then((predictions) => {
                                    if (predictions.length !== 0){
                                        ctx.fillText(predictions["0"]["className"].split(",")[0], 50, 50)
                                    }
                                    else{
                                        ctx.fillText("", 50, 50)
                                    }   
                                })
                                .catch((err) => {
                                    console.error("Inference Error !!!!!")
                                    console.error(err)
                                })
                        }, interval);

                        pause.addEventListener("click", () => {
                            stream.getTracks().forEach((track) => {
                                track.stop()
                            })
                            clearInterval(si)
                        })

                        reset.addEventListener("click", () => {
                            ctx.fillText("", 50, 50)
                            ctx.clearRect(0, 0, w, h)
                        })
                    })
                    .catch((err) => {
                        alert(err)
                    })
            })
        })
        .catch((err) => {
            console.log("Model Loading Errors")
            console.log(err)
        })
}

main()