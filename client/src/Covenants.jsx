import React, { useState, useEffect, useRef } from 'react'
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
import { Input } from '@/components/ui/input'
import axios from 'axios'
import Cookies from 'js-cookie'

const backgroundImages = [
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper4_webvsj.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper2_bvgb5f.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper3_fkv6eg.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper5_nuwrza.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper1_fnwlov.jpg',
]

const API_URL = 'https://ttcg-covenant.onrender.com/covenants'
const LOGO_URL =
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/logo_etgyhi.png'

const ScriptureOverlay = ({ scripture, reference, name }) => (
  <div className="absolute inset-0 flex items-center justify-center p-4">
    <div className="bg-black/75 p-6 rounded-lg text-center max-w-xl mx-4">
      <p className="text-xl mb-4 font-serif leading-relaxed text-[#E9CB78] whitespace-pre-wrap">
        {scripture}
      </p>
      <p className="text-lg font-bold text-[#A5722D] font-serif">{reference}</p>
      {name && (
        <p className="text-sm mt-4 text-white">
          I am {name}, this is my scriptural covenant for the year 2025!
        </p>
      )}
    </div>
  </div>
)

const CovenantSelectionPage = () => {
  const [selectedCovenant, setSelectedCovenant] = useState(null)
  const [takenCovenants, setTakenCovenants] = useState([])
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [covenants, setCovenants] = useState([])
  const [error, setError] = useState('')
  const selectedCovenantRef = useRef(null)
  const logoRef = useRef(null)
  const [userName, setUserName] = useState('')

  const handleCovenantSelect = async (covenant) => {
    if (selectedCovenant) {
      alert('You have already selected a covenant.')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/select/${covenant.id}`)
      if (response.data.message === 'Covenant selected successfully') {
        setSelectedCovenant(covenant)
        Cookies.set('selectedCovenantId', covenant.id.toString(), {
          expires: 30,
        })

        setTimeout(() => {
          if (selectedCovenantRef.current) {
            selectedCovenantRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }, 100)

        setShowImageSelector(true)
      } else {
        alert(response.data.error)
      }
    } catch (error) {
      console.error('Failed to select covenant:', error)
      alert('An error occurred while selecting the covenant.')
    }
  }

  /* const createCanvasWithText = (image, covenant, canvas) => {
    const context = canvas.getContext('2d')

    canvas.width = 1080
    canvas.height = 1080

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    context.fillStyle = '#000000a0'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const maxWidth = canvas.width * 0.8
    const lineHeight = 50
    const words = covenant.scripture.split(' ')
    let line = ''
    let lines = []

    context.font = '40px serif'
    context.fillStyle = '#E9CB78'

    words.forEach((word) => {
      const testLine = line + word + ' '
      const metrics = context.measureText(testLine)
      if (metrics.width > maxWidth) {
        lines.push(line)
        line = word + ' '
      } else {
        line = testLine
      }
    })
    lines.push(line)

    const totalTextHeight = lines.length * lineHeight
    let startY = (canvas.height - totalTextHeight) / 2

    lines.forEach((line, index) => {
      context.fillText(
        line.trim(),
        canvas.width / 2,
        startY + index * lineHeight
      )
    })

    context.font = 'bold 30px serif'
    context.fillStyle = '#A5722D'
    context.fillText(
      covenant.reference,
      canvas.width / 2,
      startY + totalTextHeight + 40
    )
  } */

const createCanvasWithText = (image, covenant, canvas) => {
  const context = canvas.getContext('2d')

  canvas.width = 1080
  canvas.height = 1080

  // Draw background
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  // Add semi-transparent overlay
  context.fillStyle = '#000000a0'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Configure text settings
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  // Draw scripture text
  const maxWidth = canvas.width * 0.8
  const lineHeight = 50
  const words = covenant.scripture.split(' ')
  let line = ''
  let lines = []

  context.font = '50px serif'
  context.fillStyle = '#E9CB78'

  // Word wrap
  words.forEach((word) => {
    const testLine = line + word + ' '
    const metrics = context.measureText(testLine)
    if (metrics.width > maxWidth) {
      lines.push(line)
      line = word + ' '
    } else {
      line = testLine
    }
  })
  lines.push(line)

  // Calculate total height and starting Y position
  const totalTextHeight = lines.length * lineHeight
  let startY = (canvas.height - totalTextHeight) / 2 - 40

  // Draw each line
  lines.forEach((line, index) => {
    context.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight)
  })

  // Draw reference
  context.font = 'bold 40px serif'
  context.fillStyle = '#A5722D'
  context.fillText(
    covenant.reference,
    canvas.width / 2,
    startY + totalTextHeight + 40
  )

  // Draw logo at bottom right
  const logoWidth = 100
  const logoHeight = 100
  const logoX = canvas.width - logoWidth - 20
  const logoY = canvas.height - logoHeight - 60

  if (logoRef.current) {
    context.drawImage(logoRef.current, logoX, logoY, logoWidth, logoHeight)
  }

  // Draw church name
  context.font = '25px serif'
  context.fillStyle = '#ffffff'
  context.textAlign = 'right'
  context.fillText(
    'The Transfiguration City Of God Church',
    canvas.width - 20,
    canvas.height - 20
  )

  // Draw user name and message if provided
  if (userName) {
    context.font = '25px serif'
    context.fillStyle = '#ffffff'
    context.textAlign = 'right'
    context.fillText(
      `I am ${userName}, this is my scriptural covenant for the year 2025!`,
      canvas.width - 20,
      canvas.height - 40
    )
  }
}  
  
const handleSave = () => {
    if (selectedImage === null || !selectedCovenant) {
      alert('Please select a covenant and background image first.')
      return
    }

    const canvas = document.createElement('canvas')
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = backgroundImages[selectedImage]

    image.onload = () => {
      createCanvasWithText(image, selectedCovenant, canvas)
      const dataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataURL
      link.download = 'covenant-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (selectedImage === null || !selectedCovenant) {
      alert('Please select a covenant and background image first.')
      return
    }

    const canvas = document.createElement('canvas')
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = backgroundImages[selectedImage]

    image.onload = () => {
      createCanvasWithText(image, selectedCovenant, canvas)
      const dataURL = canvas.toDataURL('image/png')

      if (navigator.share) {
        const blob = dataURLtoBlob(dataURL)
        navigator
          .share({
            title: 'My Covenant Image',
            text: 'Check out this beautiful covenant scripture!',
            files: [
              new File([blob], 'covenant-image.png', {
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

        const savedCovenantId = Cookies.get('selectedCovenantId')
        if (savedCovenantId) {
          const savedCovenant = response.data.find(
            (covenant) => covenant.id === parseInt(savedCovenantId, 10)
          )
          setSelectedCovenant(savedCovenant)
        }
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
          alt="Logo"
        />
        <h1 className="text-4xl font-neuemachina text-center mb-2 font-bold mt-8 text-black-900">
          The Transfiguration City Of God Church
        </h1>
      </div>
      <h1 className="text-3xl text-center mb-8 mt-8 text-black-900">
        2025 Covenant Selection
      </h1>
      <p className="text-center mb-8 text-black-600">
        Choose your personal covenant scripture
      </p>

      {selectedCovenant && (
        <div ref={selectedCovenantRef} className="mt-8">
          <Card className="border-2 border-[#A5722D] bg-black/80">
            <CardHeader>
              <CardTitle className="text-white">
                Customize Your Selected Covenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Your Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-black/50 border-[#A5722D] text-white"
                />
              </div>
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
                    name={userName}
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
        {covenants.map((covenant) => (
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
                  {/*covenant.category*/}
                </span>
                <span className="text-sm font-medium text-white">
                  {selectedCovenant?.id === covenant.id
                    ? covenant.reference
                    : '***'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2 text-white">
                {selectedCovenant?.id === covenant.id
                  ? covenant.scripture
                  : '*** Hidden until selected ***'}
              </p>
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
                      : 'hover:bg-[#A5722D] bg-black text-white'
                  }
                >
                  {selectedCovenant?.id === covenant.id ? 'Selected' : 'Select'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {error && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default CovenantSelectionPage