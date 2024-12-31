{
  selectedCovenant && (
    <div className="mt-8">
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Your Selected Covenant
          </CardTitle>
        </CardHeader>
        {/* <CardContent>
              {showCamera ? (
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <Button
                    onClick={captureImage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Take Photo
                  </Button>
                </div>
              ) : capturedImage ? (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured covenant"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 p-4 rounded-lg text-center max-w-xs shadow-lg">
                      <p className="text-sm mb-2 text-gray-700">
                        {selectedCovenant.scripture}
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {selectedCovenant.reference}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowCamera(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take a snapshot
                </Button>
              )}
            </CardContent> */}
        <CardContent>
          {showImageSelector ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {backgroundImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-[#E9CB78]'
                      : 'border-transparent'
                  }`}
                  onClick={() => {
                    setSelectedImage(index)
                    setShowImageSelector(false)
                  }}
                >
                  <img
                    src={image}
                    alt={`Background ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : selectedImage !== null ? (
            <div className="relative">
              <img
                src={backgroundImages[selectedImage]}
                alt="Selected background"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/90 p-4 rounded-lg text-center max-w-xs">
                  <p className="text-sm mb-2 text-[#E9CB78]">
                    {selectedCovenant.scripture}
                  </p>
                  <p className="text-sm font-bold text-[#A5722D]">
                    {selectedCovenant.reference}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowImageSelector(true)}
              className="bg-blue-600 hover:bg-blue-700 text-[#E9CB78]"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Background
            </Button>
          )}
        </CardContent>
        {capturedImage && (
          <CardFooter className="justify-center space-x-4">
            <Button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Save to Gallery
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}



{/* <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          className={
            selectedCategory === 'All' ? 'bg-[#A5722D] hover:bg-black-700' : ''
          }
          onClick={() => setSelectedCategory('All')}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={
              selectedCategory === category
                ? `${getCategoryColor(category)
                    .replace('bg-', 'bg-')
                    .replace('text-', 'text-')}`
                : ''
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div> */}


        /* const handleShare = () => {
    if (selectedImage === null || !selectedCovenant) {
      alert('Please select a covenant and background image first.')
      return
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new Image()

    image.src = backgroundImages[selectedImage]
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      context.fillStyle = '#E9CB78'
      context.font = '24px serif'
      context.textAlign = 'center'
      context.fillText(
        selectedCovenant.scripture,
        canvas.width / 2,
        canvas.height / 2
      )

      context.fillStyle = '#A5722D'
      context.font = 'bold 20px serif'
      context.fillText(
        selectedCovenant.reference,
        canvas.width / 2,
        canvas.height / 2 + 40
      )
      const dataURL = canvas.toDataURL('image/png')

      if (navigator.share) {
        navigator
          .share({
            title: 'My Covenant Image',
            text: 'Check out this beautiful covenant scripture!',
            files: [
              new File([dataURLtoBlob(dataURL)], 'covenant-image.png', {
                type: 'image/png',
              }),
            ],
          })
          .then(() => console.log('Shared successfully'))
          .catch((error) => console.error('Error sharing:', error))
      } else {
        navigator.clipboard
          .writeText(dataURL)
          .then(() => alert('Image link copied to clipboard.'))
          .catch((error) => console.error('Error copying link:', error))
      }
    }
  } */


    /* useEffect(() => {
    const fetchCovenants = async () => {
      try {
        const response = await axios.get('https://ttcg-covenant.onrender.com/covenants' , {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        })
        setCovenants(response.data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchCovenants()
  }, []) */


  /* const handleSave = () => {
    if (selectedImage === null || !selectedCovenant) {
      alert('Please select a covenant and background image first.')
      return
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new Image()

    image.src = backgroundImages[selectedImage]
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      context.fillStyle = '#E9CB78'
      context.font = '24px serif'
      context.textAlign = 'center'
      context.fillText(
        selectedCovenant.scripture,
        canvas.width / 2,
        canvas.height / 2
      )

      context.fillStyle = '#A5722D'
      context.font = 'bold 20px serif'
      context.fillText(
        selectedCovenant.reference,
        canvas.width / 2,
        canvas.height / 2 + 40
      )

      const dataURL = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.href = dataURL
      link.download = 'covenant-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
 */
  