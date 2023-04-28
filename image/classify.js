infer_classifier = (image, canvas, ctx, w, h, image_input, output, do_classify, reset, model) => {
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

    do_classify.addEventListener("click", () => {
        if (canvas === null){
            alert("Please Upload an Image First")
        }
        else{
            model.classify(canvas)
                .then((predictions) => {
                    if (predictions.length !== 0){
                        output.value = predictions["0"]["className"].split(",")[0]
                    }
                })
                .catch((err) => {
                    console.log("Classification Errors")
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

    let do_classify = document.querySelector("#classify")
    let reset = document.querySelector("#reset")
    let output = document.querySelector("#output")

    mobilenet.load()
        .then((model) => {
            console.log("Model Loaded") 
            section_1.hidden = true
            section_2.hidden = false
            infer_classifier(image, canvas, ctx, w, h, image_input, output, do_classify, reset, model)
        })
        .catch((err) => {
            console.log("Model Load Errors")
            console.log(err)
        })
}

main()