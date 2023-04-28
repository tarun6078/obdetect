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
    let best_detection = null
    let x1 = null,
        x2 = null,
        y1 = null,
        y2 = null 

    cocoSsd.load()
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
                            
                            model.detect(canvas)
                                .then((predictions) => {
                                    if (predictions.length !== 0){
                                        
                                        best_detection = predictions["0"]
                                        
                                        ctx.lineWidth = "3"
                                        ctx.strokeStyle = "green"
                                        x1 = Number(best_detection["bbox"][0])
                                        y1 = Number(best_detection["bbox"][1])
                                        x2 = Number(best_detection["bbox"][2])
                                        y2 = Number(best_detection["bbox"][3])
                                        ctx.strokeRect(x1, y1, x2, y2)
                                        ctx.fillText(best_detection["class"].split(",")[0], x1+25, y1+25)
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