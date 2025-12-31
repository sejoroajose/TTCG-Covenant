
import React, { useState, useEffect, useRef } from 'react'
import { Image, Share2, Download, Check, ChevronRight, Sparkles, Heart, BookOpen, Loader2 } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

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
  const [isShuffling, setIsShuffling] = useState(false)
  const [revealedCovenant, setRevealedCovenant] = useState(null)
  const [animationError, setAnimationError] = useState(false)
  const logoRef = useRef(null)
  const shuffleContainerRef = useRef(null)

  useEffect(() => {
    const fetchCovenants = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setCovenants(data)
      } catch (error) {
        console.error('Failed to fetch covenants:', error)
        // Fallback data for demo
        setCovenants([
          { id: 1, scripture: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
          { id: 2, scripture: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
          { id: 3, scripture: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
          { id: 4, scripture: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
          { id: 5, scripture: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCovenants()
  }, [])

  const handleCovenantSelect = async () => {
    if (isShuffling || covenants.length === 0) return
    
    setIsShuffling(true)
    
    // Simulate shuffle with staggered animation
    setTimeout(() => {
      selectRandomCovenant()
    }, 2000)
  }

  const selectRandomCovenant = async () => {
    const randomCovenant = covenants[Math.floor(Math.random() * covenants.length)]
    
    try {
      const response = await fetch(`${API_URL}/select/${randomCovenant.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.message === 'Covenant selected successfully') {
        setRevealedCovenant(randomCovenant)
        setTimeout(() => {
          setIsShuffling(false)
        }, 500)
      }
    } catch (error) {
      console.error('Failed to select covenant:', error)
      setRevealedCovenant(randomCovenant)
      setTimeout(() => {
        setIsShuffling(false)
      }, 500)
    }
  }

  const handleAcceptCovenant = () => {
    setSelectedCovenant(revealedCovenant)
    setStep(2)
  }

  const handleReShuffle = () => {
    setRevealedCovenant(null)
  }

  const createCanvasWithText = (image, covenant, canvas) => {
    const context = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1080

    // Draw full color background image
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    
    // Dark overlay for text readability
    context.fillStyle = '#00000080'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const maxWidth = canvas.width * 0.8
    const lineHeight = 55
    const words = covenant.scripture.split(' ')
    let line = ''
    let lines = []

    context.font = '48px "Playfair Display", serif'
    context.fillStyle = '#FFFFFF'  

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

    // Gold reference text
    context.font = 'bold 38px "Inter", sans-serif'
    context.fillStyle = '#D4AF37'
    context.fillText(covenant.reference, canvas.width / 2, startY + totalTextHeight + 60)

    // Logo (full color - gold will show naturally)
    if (logoRef.current) {
      const logoWidth = 120
      const logoHeight = 120
      const logoX = canvas.width - logoWidth - 30
      const logoY = canvas.height - logoHeight - 80
      context.drawImage(logoRef.current, logoX, logoY, logoWidth, logoHeight)
    }

    // Church name in white
    context.font = '24px "Inter", sans-serif'
    context.fillStyle = '#FFFFFF'
    context.textAlign = 'right'
    context.fillText('The Transfiguration City Of God Church', canvas.width - 30, canvas.height - 30)

    // Personal name in lighter gold
    if (userName) {
      context.font = '26px "Inter", sans-serif'
      context.fillStyle = '#FCD34D'
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
          alert('Sharing not supported. Please use the download button.')
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto w-10 h-10 text-yellow-600" />
          </div>
          <p className="text-gray-900 text-xl font-semibold mb-2">Loading Divine Covenants...</p>
          <p className="text-gray-600 text-sm">Preparing your sacred scriptures</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <img ref={logoRef} src={LOGO_URL} alt="Logo" className="hidden" crossOrigin="anonymous" />
      
      <header className="bg-white/80 backdrop-blur-md border-b border-yellow-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30"></div>
                <img 
                  src={LOGO_URL} 
                  alt="Logo" 
                  className="relative w-14 h-14 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TTCG</h1>
                <p className="text-xs text-gray-600 font-medium">Covenant Scripture 2026</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= s
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                      step > s ? 'bg-yellow-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full shadow-md">
                  ✨ Divine Selection
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Choose a Scriptural<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">
                  Covenant
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Click the sacred book below to reveal your personal scripture for 2026
              </p>
            </div>

            {!revealedCovenant ? (
              <div className="max-w-2xl mx-auto">
                <div 
                  className={`relative cursor-pointer group ${isShuffling ? 'pointer-events-none' : ''}`}
                  onClick={handleCovenantSelect}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-3xl blur-3xl group-hover:from-yellow-400/30 group-hover:to-amber-500/30 transition-all duration-500"></div>
                  <div className="relative bg-white rounded-3xl p-16 shadow-2xl border border-yellow-200/50 group-hover:border-yellow-400 transition-all duration-300 group-hover:shadow-yellow-200/50">
                    <div className="flex flex-col items-center justify-center space-y-8">
                      <div 
                        className={`w-64 h-64 flex items-center justify-center relative ${isShuffling ? 'scale-110' : ''} transition-transform duration-500`}
                      >
                        {!animationError ? (
                          <div className="w-full h-full">
                            <DotLottieReact
                              src="https://lottie.host/ff8c140b-1584-47b6-a4de-1c2d4c7053bc/EuqxRNpRB1.lottie"
                              loop
                              autoplay
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl shadow-2xl">
                            <BookOpen className="w-32 h-32 text-white drop-shadow-lg" strokeWidth={1.5} />
                          </div>
                        )}
                        
                        {isShuffling && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-3xl animate-pulse"></div>
                            <Loader2 className="w-16 h-16 text-yellow-600 animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center space-y-3">
                        <h3 className="text-3xl font-bold text-gray-900">
                          {isShuffling ? 'Revealing Your Covenant...' : 'Click to Receive'}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {isShuffling ? 'The Holy Spirit is moving...' : 'Your divine scripture awaits'}
                        </p>
                        {!isShuffling && (
                          <div className="flex items-center justify-center space-x-2 text-yellow-600 text-sm font-semibold pt-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Tap the book to begin</span>
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {isShuffling && (
                        <div ref={shuffleContainerRef} className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rounded-3xl">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className="shuffle-card absolute w-40 h-48 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-xl backdrop-blur-md border border-yellow-300/50 shadow-xl animate-shuffle"
                              style={{
                                transform: `translateX(${(i - 3) * 25}px)`,
                                zIndex: 7 - Math.abs(i - 3),
                                animationDelay: `${i * 0.12}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto animate-slideUp">
                <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-yellow-200/50">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 sm:p-10 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                    
                    <p className="text-2xl sm:text-3xl font-serif text-white leading-relaxed mb-8 text-center relative z-10">
                      "{revealedCovenant.scripture}"
                    </p>
                    <div className="flex items-center justify-center space-x-2 relative z-10">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-400"></div>
                      <p className="text-xl font-bold text-yellow-400">
                        {revealedCovenant.reference}
                      </p>
                      <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-400"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleReShuffle}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400"
                    >
                      Reveal Another
                    </button>
                    <button
                      onClick={handleAcceptCovenant}
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <span>Accept This Covenant</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedCovenant && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full shadow-md">
                  🎨 Personalize
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Customize Your Covenant</h2>
              <p className="text-lg sm:text-xl text-gray-600">Choose a background and add your personal touch</p>
            </div>

            <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 max-w-6xl mx-auto border border-yellow-200/50">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  Preview
                </h3>
                {selectedImage !== null ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-200">
                    <img
                      src={backgroundImages[selectedImage]}
                      alt="Background"
                      className="w-full h-[450px] sm:h-[550px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 flex items-center justify-center p-8">
                      <div className="text-center max-w-4xl">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-relaxed mb-6 drop-shadow-lg">
                          {selectedCovenant.scripture}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 drop-shadow-md">
                          {selectedCovenant.reference}
                        </p>
                        {userName && (
                          <p className="text-lg sm:text-xl text-amber-200 mt-6 drop-shadow-md">
                            I am {userName}, this is my covenant scripture for 2026
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-4 border-dashed border-yellow-300 rounded-2xl h-[450px] sm:h-[550px] flex items-center justify-center bg-yellow-50/50">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Image className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-600 text-lg font-medium">Select a background image below</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-10">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Choose Background
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {backgroundImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                        selectedImage === index
                          ? 'ring-4 ring-yellow-500 shadow-2xl scale-105'
                          : 'ring-2 ring-gray-200 hover:ring-yellow-300'
                      }`}
                    >
                      <img src={image} alt={`Background ${index + 1}`} className="w-full h-28 sm:h-36 object-cover" />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 flex items-center justify-center">
                          <div className="bg-white rounded-full p-2 shadow-lg">
                            <Check className="w-6 h-6 text-yellow-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Add Your Name (Optional)
                </h3>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all bg-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setStep(1)
                    setRevealedCovenant(null)
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all border border-gray-300 hover:border-gray-400"
                >
                  Back to Selection
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedImage === null}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
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
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full shadow-md">
                  🎉 Complete
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Your Covenant is Ready!</h2>
              <p className="text-lg sm:text-xl text-gray-600">Download or share your personalized covenant</p>
            </div>

            <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 max-w-5xl mx-auto border border-yellow-200/50">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border-2 border-yellow-200">
                <img
                  src={backgroundImages[selectedImage]}
                  alt="Final"
                  className="w-full h-[550px] sm:h-[650px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 flex items-center justify-center p-8">
                  <div className="text-center max-w-4xl">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-relaxed mb-6 drop-shadow-lg">
                      {selectedCovenant.scripture}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 drop-shadow-md">
                      {selectedCovenant.reference}
                    </p>
                    {userName && (
                      <p className="text-lg sm:text-xl text-amber-200 mt-4 sm:mt-6">
                        I am {userName}, this is my covenant scripture for 2026
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 sm:py-5 px-6 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
                >
                  <Download className="w-5 sm:w-6 h-5 sm:h-6 group-hover:animate-bounce" />
                  <span className="text-base sm:text-lg">Download Image</span>
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 sm:py-5 px-6 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl group"
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
                  setRevealedCovenant(null)
                }}
                className="w-full mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all"
              >
                Create Another Covenant
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20 py-12 border-t-4 border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="h-16 sm:h-20 mx-auto mb-4"
          />
          <h3 className="text-xl sm:text-2xl font-bold mb-2">The Transfiguration City Of God Church</h3>
          <p className="text-gray-400 mb-4">Raising Generals for God.</p>
          <p className="text-sm text-gray-500">© 2026 TTCG. All rights reserved.</p>
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

        @keyframes shuffle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) rotate(-10deg);
          }
          75% {
            transform: translateY(-30px) rotate(10deg);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shuffle {
          animation: shuffle 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default CovenantSelectionPage