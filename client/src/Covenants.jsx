import React, { useState, useEffect } from 'react'
import { ImageIcon, Share2, Download, Lock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios'

const backgroundImages = [
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper4_webvsj.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper2_bvgb5f.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper3_fkv6eg.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper5_nuwrza.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper1_fnwlov.jpg',
]

const API_URL = 'http://localhost:8080/covenants' ;


const ScriptureOverlay = ({ scripture, reference }) => (
  <div className="absolute inset-0 flex items-center justify-center p-4">
    <div className="bg-black/75 p-6 rounded-lg text-center max-w-xl mx-4">
      <p className="text-xl mb-4 font-serif leading-relaxed text-[#E9CB78]">
        {scripture}
      </p>
      <p className="text-lg font-bold text-[#A5722D] font-serif">{reference}</p>
    </div>
  </div>
)

const CovenantSelectionPage = () => {
  const [selectedCovenant, setSelectedCovenant] = useState(null)
  const [takenCovenants, setTakenCovenants] = useState([])
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [covenants, setCovenants] = useState([])
  const [error, setError] = useState('')

  const filteredCovenants =
    selectedCategory === 'All'
      ? covenants
      : covenants.filter((covenant) => covenant.category === selectedCategory)

  const captureImage = () => {
    setShowCamera(false)
    setCapturedImage('/api/placeholder/400/300')
    setShowAlert(true)
  }

  const handleCovenantSelect = async (covenant) => {
    if (takenCovenants.includes(covenant.id)) {
      alert('This covenant is already selected.')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/select/${covenant.id}`)
      if (response.data.message === 'Covenant selected successfully') {
        setSelectedCovenant(covenant)
        setTakenCovenants([...takenCovenants, covenant.id])
      } else {
        alert(response.data.error)
      }
    } catch (error) {
      console.error('Failed to select covenant:', error)
      alert('An error occurred while selecting the covenant.')
    }
  }

  
  const handleSave = () => {
    if (selectedImage === null || !selectedCovenant) {
      alert('Please select a covenant and background image first.')
      return
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new Image()

    image.crossOrigin = 'anonymous'

    image.src = backgroundImages[selectedImage]
    image.onload = () => {
      canvas.width = 1080
      canvas.height = 1080

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      context.fillStyle = '#000000a0' 
      context.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3)

      context.fillStyle = '#E9CB78'
      context.font = '40px serif'
      context.textAlign = 'center'
      context.fillText(
        selectedCovenant.scripture,
        canvas.width / 2,
        canvas.height / 2
      )

      context.fillStyle = '#A5722D'
      context.font = 'bold 30px serif'
      context.fillText(
        selectedCovenant.reference,
        canvas.width / 2,
        canvas.height / 2 + 50
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
  

    const dataURLtoBlob = (dataURL) => {
      const parts = dataURL.split(';base64,')
      const byteString = atob(parts[1])
      const mimeType = parts[0].split(':')[1]

      const arrayBuffer = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i)
      }

      return new Blob([arrayBuffer], { type: mimeType })
    }


    const handleShare = () => {
      if (selectedImage === null || !selectedCovenant) {
        alert('Please select a covenant and background image first.')
        return
      }

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = backgroundImages[selectedImage]
      image.onload = () => {
        canvas.width = 1080
        canvas.height = 1080

        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        
        context.fillStyle = '#000000a0' 
        context.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3)

        
        context.fillStyle = '#E9CB78'
        context.font = '40px serif'
        context.textAlign = 'center'
        context.fillText(
          selectedCovenant.scripture,
          canvas.width / 2,
          canvas.height / 2
        )
        
        context.fillStyle = '#A5722D'
        context.font = 'bold 30px serif'
        context.fillText(
          selectedCovenant.reference,
          canvas.width / 2,
          canvas.height / 2 + 50
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
    }
  

  const getCategoryColor = (category) => {
    const colors = {
      Promise: 'bg-blue-100 text-blue-800',
      Strength: 'bg-green-100 text-green-800',
      Protection: 'bg-purple-100 text-purple-800',
      Peace: 'bg-teal-100 text-teal-800',
      Faith: 'bg-indigo-100 text-indigo-800',
      Guidance: 'bg-amber-100 text-amber-800',
      Hope: 'bg-rose-100 text-rose-800',
      Provision: 'bg-cyan-100 text-cyan-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  
  useEffect(() => {
    const fetchCovenants = async () => {
      try {
        const response = await axios.get(API_URL)
        setCovenants(response.data)
        const selectedCovenants = response.data
          .filter((covenant) => covenant.is_selected)
          .map((covenant) => covenant.id)
        setTakenCovenants(selectedCovenants)
      } catch (error) {
        console.error('Failed to fetch covenants:', error)
        setError('Failed to load covenants.')
      }
    }
    fetchCovenants()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div>
        <img
          src="https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/logo_etgyhi.png"
          className="px-8"
        />
        <h1 className="text-4xl font-neuemachina text-center mb-2 font-bold mt-8 text-black-900">
          The Transfiguration City Of God Church
        </h1>
      </div>
      <h1 className="text-3xl  text-center mb-8 mt-8 text-black-900">
        2025 Covenant Selection
      </h1>
      <p className="text-center mb-8 text-black-600">
        Choose your personal covenant scripture
      </p>

      {selectedCovenant && (
        <div className="mt-8">
          <Card className="border-2 border-[#A5722D] bg-black/80">
            <CardHeader>
              <CardTitle className="text-white">
                Your Selected Covenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showImageSelector ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {backgroundImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-[#E9CB78] transition-all ${
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
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all" />
                    </div>
                  ))}
                </div>
              ) : selectedImage !== null ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={backgroundImages[selectedImage]}
                    alt="Selected background"
                    className="w-full object-cover max-h-[500px]"
                  />
                  <ScriptureOverlay
                    scripture={selectedCovenant.scripture}
                    reference={selectedCovenant.reference}
                  />
                </div>
              ) : (
                <Button
                  onClick={() => setShowImageSelector(true)}
                  className="bg-[#A5722D] hover:bg-[#8B5E24] text-white w-full py-8"
                >
                  <ImageIcon className="w-6 h-6 mr-2" />
                  Choose Background Image
                </Button>
              )}
            </CardContent>
            {selectedImage !== null && (
              <CardFooter className="justify-center space-x-4 mt-4 pb-6">
                <Button
                  onClick={handleShare}
                  className="bg-black hover:bg-[#8B5E24] text-white px-6 py-2"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="bg-black border-[#A5722D] text-white hover:bg-[#A5722D]/20 px-6 py-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save to Gallery
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 lg:grid-cols-3 gap-6">
        {filteredCovenants.map((covenant) => (
          <Card
            key={covenant.id}
            className={`relative hover:shadow-lg transition-shadow ${
              takenCovenants.includes(covenant.id) &&
              covenant.id !== selectedCovenant?.id
                ? 'opacity-50'
                : 'hover:shadow-xl'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(
                    covenant.category
                  )}`}
                >
                  {covenant.category}
                </span>
                <span className="text-sm font-medium text-[#A5722D]">
                  {covenant.reference}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 text-gray-700">{covenant.scripture}</p>
            </CardContent>
            <CardFooter className="justify-between">
              {takenCovenants.includes(covenant.id) &&
              covenant.id !== selectedCovenant?.id ? (
                <div className="flex items-center text-gray-500">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Already Taken</span>
                </div>
              ) : (
                <Button
                  onClick={() => handleCovenantSelect(covenant)}
                  variant={
                    selectedCovenant?.id === covenant.id
                      ? 'secondary'
                      : 'default'
                  }
                  className={
                    selectedCovenant?.id === covenant.id
                      ? `${getCategoryColor(covenant.category)} border-2`
                      : 'hover:bg-[#A5722D] bg-black'
                  }
                >
                  {selectedCovenant?.id === covenant.id ? 'Selected' : 'Select'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {showAlert && (
        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            Photo captured successfully! You can now share it or save to your
            gallery.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default CovenantSelectionPage
