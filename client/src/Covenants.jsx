import React, { useState, useEffect } from 'react'
import { ImageIcon, Share2, Download, Lock } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

const backgroundImages = [
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper4_webvsj.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper2_bvgb5f.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper3_fkv6eg.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper5_nuwrza.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper1_fnwlov.jpg',
]

const API_URL = 'https://ttcg-covenant.onrender.com/covenants'

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
  const [covenants, setCovenants] = useState([])
  const [selectedCovenant, setSelectedCovenant] = useState(null)
  const [takenCovenants, setTakenCovenants] = useState([])
  const [visibleCovenants, setVisibleCovenants] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState('')

  const filteredCovenants =
    selectedCategory === 'All'
      ? covenants
      : covenants.filter((covenant) => covenant.category === selectedCategory)

  const toggleVisibility = (id) => {
    setVisibleCovenants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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
      } else {
        alert(response.data.error)
      }
    } catch (error) {
      console.error('Failed to select covenant:', error)
      alert('An error occurred while selecting the covenant.')
    }
  }

  const handleSave = () => {
    if (!selectedImage || !selectedCovenant) {
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
        <h1 className="text-4xl font-neuemachina text-center mb-2 font-bold mt-8 text-black-900">
          Covenant Selection
        </h1>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {filteredCovenants.map((covenant) => (
          <Card
            key={covenant.id}
            className={`relative ${getCategoryColor(covenant.category)}`}
          >
            <CardHeader>
              <CardTitle>{covenant.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{covenant.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleVisibility(covenant.id)}>
                {visibleCovenants[covenant.id]
                  ? 'Hide Details'
                  : 'Show Details'}
              </Button>
              <Button
                className="ml-2"
                onClick={() => handleCovenantSelect(covenant)}
                disabled={takenCovenants.includes(covenant.id)}
              >
                Select
              </Button>
            </CardFooter>
            {visibleCovenants[covenant.id] && (
              <ScriptureOverlay
                scripture={covenant.scripture}
                reference={covenant.reference}
              />
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={handleSave}>Save Covenant Image</Button>
      </div>
    </div>
  )
}

export default CovenantSelectionPage
