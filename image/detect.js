infer_detector = (image, canvas, ctx, w, h, image_input, output, do_detect, reset, model) => {
    image_input.addEventListener("change", (e1) => {
        output.value = ""
        if(e1.target.files){
            let imageFile = e1.target.files[0]
            let reader = new FileReader()
            reader.readAsDataURL(imageFile)
            reader.onload = (e2) => {
                image.src = e2.target.result
                image.onload = () => {
                    canvas = document.querySelector("canvas")
                    ctx = canvas.getContext("2d")
                    w = canvas.getAttribute("width")
                    h = canvas.getAttribute("height")
                    ctx.drawImage(image, 0, 0, w, h)
                }
            }
        }
    })

    do_detect.addEventListener("click", () => {
        if (canvas === null){
            alert("Please Upload an Image First")
        }
        else{
            model.detect(canvas)
                .then((predictions) => {
                    if (predictions.length !== 0){
                        best_detection = predictions["0"]
                        output.value = best_detection["class"]

                        ctx.lineWidth = "4"
                        ctx.strokeStyle = "green"
                        ctx.strokeRect(Number(best_detection["bbox"][0]), Number(best_detection["bbox"][1]), Number(best_detection["bbox"][2]), Number(best_detection["bbox"][3]))
                    }
                })
                .catch((err) => {
                    console.log("Detection Errors")
                    console.log(err)
                })
        }
    })

    reset.addEventListener("click", () => {
        image.src = ""
        image_input.value = ""
        output.value = ""
        ctx.clearRect(0, 0, w, h)
        canvas = null
    })
}


main = () => {
    let section_1 = document.querySelector("#section_1")
    let section_2 = document.querySelector("#section_2")

    let image_input = document.querySelector("#image_input")

    let canvas = null
    let ctx = null
    let w = null
    let h = null
    
    let image = new Image()

    let do_detect = document.querySelector("#detect")
    let reset = document.querySelector("#reset")
    let output = document.querySelector("#output")

    cocoSsd.load()
        .then((model) => {
            console.log("Model Loaded") 
            section_1.hidden = true
            section_2.hidden = false
            infer_detector(image, canvas, ctx, w, h, image_input, output, do_detect, reset, model)
        })
        .catch((err) => {
            console.log("Model Load Errors")
            console.log(err)
        })
}

main()