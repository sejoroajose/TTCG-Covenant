import React, { useState, useEffect, useRef } from 'react'
import { Image, Share2, Download, Check, ChevronRight, Sparkles, Heart } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const backgroundImages = [
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper4_webvsj.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/wallpapper2_bvgb5f.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper3_fkv6eg.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper5_nuwrza.jpg',
  'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667893/wallpapper1_fnwlov.jpg',
]

const API_URL = 'http://localhost:8080/covenants'
const LOGO_URL = 'https://res.cloudinary.com/dnu6az3um/image/upload/v1735667894/logo_etgyhi.png'

const CovenantSelectionPage = () => {
  const [step, setStep] = useState(1)
  const [selectedCovenant, setSelectedCovenant] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [userName, setUserName] = useState('')
  const [covenants, setCovenants] = useState([])
  const [loading, setLoading] = useState(true)
  const logoRef = useRef(null)

  useEffect(() => {
    const fetchCovenants = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setCovenants(data)
      } catch (error) {
        console.error('Failed to fetch covenants:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCovenants()
  }, [])

  const handleCovenantSelect = async (covenant) => {
    try {
      const response = await fetch(`${API_URL}/select/${covenant.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.message === 'Covenant selected successfully') {
        setSelectedCovenant(covenant)
        setStep(2)
      }
    } catch (error) {
      console.error('Failed to select covenant:', error)
    }
  }

  const createCanvasWithText = (image, covenant, canvas) => {
    const context = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1080

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000000c0'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const maxWidth = canvas.width * 0.8
    const lineHeight = 55
    const words = covenant.scripture.split(' ')
    let line = ''
    let lines = []

    context.font = '48px "Playfair Display", serif'
    context.fillStyle = '#F5E6D3'

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
    let startY = (canvas.height - totalTextHeight) / 2 - 60

    lines.forEach((line, index) => {
      context.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight)
    })

    context.font = 'bold 38px "Inter", sans-serif'
    context.fillStyle = '#D4AF37'
    context.fillText(covenant.reference, canvas.width / 2, startY + totalTextHeight + 60)

    if (logoRef.current) {
      const logoWidth = 120
      const logoHeight = 120
      const logoX = canvas.width - logoWidth - 30
      const logoY = canvas.height - logoHeight - 80
      context.drawImage(logoRef.current, logoX, logoY, logoWidth, logoHeight)
    }

    context.font = '24px "Inter", sans-serif'
    context.fillStyle = '#ffffff'
    context.textAlign = 'right'
    context.fillText('The Transfiguration City Of God Church', canvas.width - 30, canvas.height - 30)

    if (userName) {
      context.font = '26px "Inter", sans-serif'
      context.fillStyle = '#ffffff'
      context.textAlign = 'center'
      context.fillText(
        `I am ${userName}, this is my covenant scripture for 2026`,
        canvas.width / 2,
        startY + totalTextHeight + 120
      )
    }
  }

  const handleDownload = () => {
    if (selectedImage === null || !selectedCovenant) return

    const canvas = document.createElement('canvas')
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = backgroundImages[selectedImage]

    image.onload = () => {
      createCanvasWithText(image, selectedCovenant, canvas)
      const dataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataURL
      link.download = `covenant-2026-${selectedCovenant.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (selectedImage === null || !selectedCovenant) return

    const canvas = document.createElement('canvas')
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = backgroundImages[selectedImage]

    image.onload = async () => {
      createCanvasWithText(image, selectedCovenant, canvas)
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'covenant-2026.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'My 2026 Covenant',
              text: `${selectedCovenant.scripture} - ${selectedCovenant.reference}`,
              files: [file]
            })
          } catch (error) {
            console.error('Error sharing:', error)
          }
        } else {
          const dataURL = canvas.toDataURL('image/png')
          alert('Image ready! Right-click the preview to save.')
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-900 text-lg font-medium">Loading Covenants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <img ref={logoRef} src={LOGO_URL} alt="Logo" className="hidden" crossOrigin="anonymous" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={LOGO_URL} alt="Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900">TTCG</h1>
                <p className="text-sm text-amber-700">Covenant Scripture Selection. 2026</p>
              </div>
            </div>

            <DotLottieReact
              src="./assets/bible.lottie"
              loop
              autoplay
            />

            <div className="hidden sm:flex items-center space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s
                      ? 'bg-amber-600 text-white shadow-lg scale-110'
                      : 'bg-white text-amber-400 border-2 border-amber-200'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4">Choose Your Covenant</h2>
              <p className="text-lg sm:text-xl text-amber-700 max-w-2xl mx-auto">
                Select a scripture that resonates with your journey for 2026
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {covenants.map((covenant, index) => (
                <div
                  key={covenant.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleCovenantSelect(covenant)}
                >
                  <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-800"></div>
                  <div className="p-6">
                    <div className="text-sm font-semibold text-amber-600 mb-2">
                      {covenant.category || 'Scripture'}
                    </div>
                    <p className="text-gray-800 leading-relaxed line-clamp-4 mb-3">
                      {covenant.scripture}
                    </p>
                    <p className="text-amber-900 font-semibold mb-4">{covenant.reference}</p>
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg">
                      <span>Select This Covenant</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedCovenant && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4">Customize Your Covenant</h2>
              <p className="text-lg sm:text-xl text-amber-700">Choose a background and add your personal touch</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-5xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Preview</h3>
                {selectedImage !== null ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={backgroundImages[selectedImage]}
                      alt="Background"
                      className="w-full h-[400px] sm:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 sm:p-8">
                      <div className="text-center max-w-3xl">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 leading-relaxed mb-4 sm:mb-6">
                          {selectedCovenant.scripture}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                          {selectedCovenant.reference}
                        </p>
                        {userName && (
                          <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">
                            I am {userName}, this is my covenant scripture for 2026
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-4 border-dashed border-amber-300 rounded-2xl h-[400px] sm:h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <Image className="w-16 sm:w-20 h-16 sm:h-20 text-amber-400 mx-auto mb-4" />
                      <p className="text-amber-600 text-base sm:text-lg">Select a background image below</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 mr-2 text-amber-600" />
                  Choose Background
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {backgroundImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                        selectedImage === index
                          ? 'ring-4 ring-amber-600 shadow-2xl scale-105'
                          : 'ring-2 ring-transparent hover:ring-amber-300'
                      }`}
                    >
                      <img src={image} alt={`Background ${index + 1}`} className="w-full h-24 sm:h-32 object-cover" />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-amber-600/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2">
                            <Check className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Heart className="w-5 sm:w-6 h-5 sm:h-6 mr-2 text-amber-600" />
                  Add Your Name (Optional)
                </h3>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-600 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all"
                >
                  Back to Selection
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedImage === null}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && selectedCovenant && selectedImage !== null && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4">Your Covenant is Ready!</h2>
              <p className="text-lg sm:text-xl text-amber-700">Download or share your personalized covenant</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
                <img
                  src={backgroundImages[selectedImage]}
                  alt="Final"
                  className="w-full h-[500px] sm:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 sm:p-8">
                  <div className="text-center max-w-3xl">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 leading-relaxed mb-4 sm:mb-6">
                      {selectedCovenant.scripture}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                      {selectedCovenant.reference}
                    </p>
                    {userName && (
                      <p className="text-lg sm:text-xl text-white mt-4 sm:mt-6">
                        I am {userName}, this is my covenant scripture for 2026
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 sm:py-5 px-6 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
                >
                  <Download className="w-5 sm:w-6 h-5 sm:h-6 group-hover:animate-bounce" />
                  <span className="text-base sm:text-lg">Download Image</span>
                </button>
                <button
                  onClick={handleShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 sm:py-5 px-6 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
                >
                  <Share2 className="w-5 sm:w-6 h-5 sm:h-6 group-hover:rotate-12 transition-transform" />
                  <span className="text-base sm:text-lg">Share</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setStep(1)
                  setSelectedCovenant(null)
                  setSelectedImage(null)
                  setUserName('')
                }}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all"
              >
                Create Another Covenant
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-amber-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={LOGO_URL} alt="Logo" className=" h-16 sm:h-20 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl sm:text-2xl font-bold mb-2">The Transfiguration City Of God Church</h3>
          <p className="text-amber-200 mb-4">Raising Generals for God.</p>
          <p className="text-sm text-amber-300">© 2026 TTCG. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default CovenantSelectionPage